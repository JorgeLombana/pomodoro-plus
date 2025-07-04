import {
  Injectable,
  signal,
  computed,
  inject,
  Signal,
  DestroyRef,
} from '@angular/core';
import { interval, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimerState } from './timer.types';

@Injectable({ providedIn: 'root' })
export class TimerStore {
  // Constants and dependencies
  readonly #DEFAULT_DURATION = 1 * 60;
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #destroy$ = new Subject<void>();

  // Internal state
  #timerSubscription: Subscription | null = null;

  readonly #state = signal<TimerState>({
    duration: this.#DEFAULT_DURATION,
    timeLeft: this.#DEFAULT_DURATION,
    isRunning: false,
  });

  // Public selectors
  readonly timeLeft: Signal<number> = computed(() => this.#state().timeLeft);
  readonly isRunning: Signal<boolean> = computed(() => this.#state().isRunning);
  readonly duration: Signal<number> = computed(() => this.#state().duration);

  constructor() {
    this.#destroyRef.onDestroy(() => {
      this.#destroy$.next();
      this.#destroy$.complete();
      this.cleanupTimer();
    });
  }

  // Public API
  public start(): void {
    if (this.isRunning()) return;

    this.cleanupTimer();

    this.updateState({ isRunning: true });

    this.#timerSubscription = interval(1000)
      .pipe(takeUntil(this.#destroy$))
      .subscribe(() => {
        const current = this.#state();
        const newTimeLeft = Math.max(current.timeLeft - 1, 0);

        this.#state.set({
          ...current,
          timeLeft: newTimeLeft,
          isRunning: newTimeLeft > 0,
        });

        if (newTimeLeft === 0) {
          this.cleanupTimer();
        }
      });
  }

  public pause(): void {
    if (!this.isRunning()) return;
    this.cleanupTimer();
    this.updateState({ isRunning: false });
  }

  public reset(): void {
    this.cleanupTimer();

    const { duration } = this.#state();
    this.#state.set({
      duration,
      timeLeft: duration,
      isRunning: false,
    });
  }

  public setDuration(seconds: number): void {
    if (seconds <= 0) return;
    this.cleanupTimer();
    this.#state.set({
      duration: seconds,
      timeLeft: seconds,
      isRunning: false,
    });
  }

  // Internal utilities

  private updateState(partial: Partial<TimerState>): void {
    this.#state.update((state) => ({ ...state, ...partial }));
  }

  private cleanupTimer(): void {
    this.#timerSubscription?.unsubscribe();
    this.#timerSubscription = null;
  }
}
