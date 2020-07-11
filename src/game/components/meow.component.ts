import { Assets } from '../assets';
import { Component } from '../component';

export class MeowComponent extends Component {

  public static readonly KEY = Symbol();

  private interval = 3000;
  private timeUntilSound: number;
  private meowChance: number = 0.1;

  constructor() {
    super(MeowComponent.KEY);

    this.timeUntilSound = this.interval;
  }

  public update(delta: number) {
    if (this.isSoundReady(delta)) {
      this.attemptSound();
      this.resetSoundTimer();
    }
  }

  private isSoundReady(delta: number): boolean {
    this.timeUntilSound -= delta;
    return this.timeUntilSound <= 0;
  }

  private attemptSound(): void {
    if (this.shouldPlaySound()) {
      this.playSound();
    }
  }

  private shouldPlaySound(): boolean {
    return Math.random() < this.meowChance;
  }

  private playSound(): void {
    new Audio(`${Assets.SOUNDS_BASEPATH}/meow1.ogg`).play();
  }

  private resetSoundTimer(): void {
    this.timeUntilSound = this.interval;
  }

}
