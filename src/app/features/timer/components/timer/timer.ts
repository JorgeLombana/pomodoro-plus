import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerStore } from '../../data-access/timer-store';

@Component({
  selector: 'app-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})
export class TimerComponent {
  readonly timerStore = inject(TimerStore);
  readonly isRunning = this.timerStore.isRunning;
  readonly buttonText = computed(() => (this.isRunning() ? 'Pause' : 'Start'));

  readonly formattedTime = computed(() => {
    const timeLeft = this.timerStore.timeLeft();
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  });

  handleTimerClick(): void {
    if (this.isRunning()) {
      this.timerStore.pause();
    } else {
      this.timerStore.start();
    }
  }
}
