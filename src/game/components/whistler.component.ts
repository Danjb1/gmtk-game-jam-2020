import { Input } from '../input';
import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getHitboxFrom, Vector } from '../utils';
import { Assets } from '../assets';

export interface WhistleListener {
  whistleHeard(location: Vector): void;
}

export class WhistlerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private listeners: WhistleListener[] = [];

  constructor(private input: Input) {
    super(WhistlerComponent.KEY);
  }

  onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  update(delta: number): void {
    if (this.input.isPressed(Input.WHISTLE)) {
      this.blastWhistle();
    }
  }

  blastWhistle(): void {
    Assets.playSound('whistle.ogg', true);
    this.listeners.forEach(l => l.whistleHeard(this.hitbox.centrePosition));
  }

  addListener(listener: WhistleListener): void {
    this.listeners.push(listener);
  }
}
