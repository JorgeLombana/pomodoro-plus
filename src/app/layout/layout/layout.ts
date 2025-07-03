import { Component } from '@angular/core';
import { Header } from '../header/header';
import { Timer } from '../../timer/timer/timer';

@Component({
  selector: 'pomo-plus-layout',
  imports: [Header, Timer],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout {}
