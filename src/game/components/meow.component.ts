import { Assets } from '../assets';
import { Component } from '../component';
import { intBetween } from '../utils';

export class MeowComponent extends Component {

  public static readonly KEY = Symbol();

  private static readonly NUM_SOUNDS = 13;

  private interval = 2500;
  private timeUntilSound: number;
  private meowChance: number = 0.1;

  constructor(interval: number, chance: number) {
    super(MeowComponent.KEY);

    this.timeUntilSound = this.interval = interval;
    this.meowChance = chance;
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
    let soundId = intBetween(1, MeowComponent.NUM_SOUNDS).toString();
    if (soundId.length < 2) {
      soundId = '0' + soundId;
    }

    const audio = new Audio(`${Assets.SOUNDS_BASEPATH}/meow${soundId}.ogg`);

    // Wait until the audio is playable
    audio.addEventListener('canplaythrough', event => {
      audio.play();
    });
  }

  private resetSoundTimer(): void {
    this.timeUntilSound = this.interval;
  }

}
