import { Component, signal } from '@angular/core';

@Component({
  selector: 'pomo-plus-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer {
  public counter = signal(0);
  public buttonText = signal('Start');
}
