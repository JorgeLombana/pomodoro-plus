export type TimerType = 'pomodoro' | 'shortBreak' | 'longBreak';

export interface TimerState {
  readonly duration: number;
  readonly timeLeft: number;
  readonly isRunning: boolean;
  readonly timerType: TimerType;
  readonly percent: number;
}
