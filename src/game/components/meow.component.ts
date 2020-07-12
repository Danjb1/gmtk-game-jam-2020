import { Assets } from '../assets';
import { Component } from '../component';
import { intBetween } from '../utils';

export class MeowComponent extends Component {

  public static readonly KEY = Symbol();

  private static readonly NUM_SOUNDS = 12;

  constructor() {
    super(MeowComponent.KEY);
  }

  public notify(event: any) {
    if (event === 'jailed') {
      this.meow();
    } else if (event === 'escaped') {
      this.hiss();
    }
  }

  private meow(): void {
    let soundId = intBetween(1, MeowComponent.NUM_SOUNDS).toString();
    if (soundId.length < 2) {
      soundId = '0' + soundId;
    }

    Assets.playSound(`meow${soundId}.ogg`);
  }

  private hiss(): void {
    Assets.playSound("hiss01.ogg", true);
  }
}
