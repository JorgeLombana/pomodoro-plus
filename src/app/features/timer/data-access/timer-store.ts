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
import { TimerState, TimerType } from './timer.types';

@Injectable({ providedIn: 'root' })
export class TimerStore {
  // Constants and dependencies
  readonly #DEFAULT_DURATION = {
    pomodoro: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };
  readonly #destroyRef: DestroyRef = inject(DestroyRef);
  readonly #destroy$ = new Subject<void>();

  // Internal state
  #timerSubscription: Subscription | null = null;

  readonly #state = signal<TimerState>({
    duration: this.#DEFAULT_DURATION.pomodoro,
    timeLeft: this.#DEFAULT_DURATION.pomodoro,
    isRunning: false,
    timerType: 'pomodoro',
    percent: 0,
  });

  // Public selectors
  readonly timeLeft: Signal<number> = computed(() => this.#state().timeLeft);
  readonly isRunning: Signal<boolean> = computed(() => this.#state().isRunning);
  readonly duration: Signal<number> = computed(() => this.#state().duration);
  readonly percent: Signal<number> = computed(() => this.#state().percent);
  readonly activeTimerType: Signal<TimerType> = computed(
    () => this.#state().timerType
  );

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
        const percent =
          ((current.duration - newTimeLeft) / current.duration) * 100;

        this.#state.set({
          ...current,
          timeLeft: newTimeLeft,
          isRunning: newTimeLeft > 0,
          percent: percent,
        });

        if (newTimeLeft === 0) {
          this.cleanupTimer();
        }
        console.log(this.timeLeft());
      });
  }

  public setTimerType(timerType: TimerType) {
    this.cleanupTimer();
    this.#state.set({
      duration: this.#DEFAULT_DURATION[timerType],
      timeLeft: this.#DEFAULT_DURATION[timerType],
      isRunning: false,
      timerType: timerType,
      percent: 0,
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
      ...this.#state(),
      timeLeft: duration,
      isRunning: false,
    });
  }

  public setDuration(seconds: number): void {}

  // Internal utilities

  private updateState(partial: Partial<TimerState>): void {
    this.#state.update((state) => ({ ...state, ...partial }));
  }

  private cleanupTimer(): void {
    this.#timerSubscription?.unsubscribe();
    this.#timerSubscription = null;
  }
}
