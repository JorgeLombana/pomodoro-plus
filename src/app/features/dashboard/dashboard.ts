import { Component } from '@angular/core';
import { TimerComponent } from "./timer/timer";

@Component({
  selector: 'pp-dashboard',
  imports: [TimerComponent],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {

}
