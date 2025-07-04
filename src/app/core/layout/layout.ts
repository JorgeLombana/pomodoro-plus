import { Component } from '@angular/core';
import { TimerComponent } from '../../features/timer/components/timer/timer';

@Component({
  selector: 'pomo-plus-layout',
  imports: [TimerComponent],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
