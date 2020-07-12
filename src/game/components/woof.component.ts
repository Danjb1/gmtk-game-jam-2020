import { Assets } from '../assets';
import { Component } from '../component';
import { intBetween } from '../utils';

export class WoofComponent extends Component {

  public static readonly KEY = Symbol();

  private static readonly NUM_SOUNDS = 1;

  private interval = 2500;
  private timeUntilSound: number;
  private woofChance: number = 0.1;

  constructor(interval: number, chance: number) {
    super(WoofComponent.KEY);

    this.timeUntilSound = this.interval = interval;
    this.woofChance = chance;
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
    return Math.random() < this.woofChance;
  }

  public playSound(): void {
    let soundId = intBetween(1, WoofComponent.NUM_SOUNDS).toString();
    if (soundId.length < 2) {
      soundId = '0' + soundId;
    }

    const audio = new Audio(`${Assets.SOUNDS_BASEPATH}/woof${soundId}.ogg`);

    // Wait until the audio is playable
    audio.addEventListener('canplaythrough', event => {
      audio.play();
    });
  }

  private resetSoundTimer(): void {
    this.timeUntilSound = this.interval;
  }

}
