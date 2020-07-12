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

    const audio = new Audio(`${Assets.SOUNDS_BASEPATH}/meow${soundId}.ogg`);

    // Wait until the audio is playable
    audio.addEventListener('canplaythrough', event => {
      audio.play();
    });
  }

  private hiss(): void {
    
    const audio = new Audio(`${Assets.SOUNDS_BASEPATH}/hiss01.ogg`);

    // Wait until the audio is playable
    audio.addEventListener('canplaythrough', event => {
      audio.play();
    });
  }

}
