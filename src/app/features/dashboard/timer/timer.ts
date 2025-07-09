import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimerStore } from './store/timer-store';
import { TimerType } from './models/timer.types';

@Component({
  selector: 'pp-timer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timer.html',
  styleUrls: ['./timer.scss'],
})
export class TimerComponent {
  readonly timerStore = inject(TimerStore);
  readonly isRunning = this.timerStore.isRunning;
  readonly progress = this.timerStore.percent;
  readonly buttonText = computed(() => (this.isRunning() ? 'Pause' : 'Start'));

  readonly tabs: { label: string; type: TimerType }[] = [
    { label: 'Pomodoro', type: 'pomodoro' },
    { label: 'Short break', type: 'shortBreak' },
    { label: 'Long break', type: 'longBreak' },
  ];

  activeTab = signal<TimerType>('pomodoro');

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
  setActiveTab(tab: TimerType) {
    this.activeTab.set(tab);
    this.timerStore.setTimerType(tab);
  }
}
