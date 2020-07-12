import { Entity } from '../entity';
import { Game } from '../game';
import { Component } from '../component';

// Components
import { CatMetaComponent } from './cat-meta.component';
import { JailedComponent } from './jailed.component';
import { HitboxComponent } from './hitbox.component';


export class EscapeComponent extends Component {

  // fraction: 1 = always escape, 0 = never escape
  private chanceOfEscape = 0.005;

  // Minimum time in prison, in milliseconds
  private minCaptureTime = 500;

  private _jailedAt: number;
  private _catMeta: CatMetaComponent;

  public static readonly KEY = Symbol();

  constructor(chanceOfEscape: number, minCaptureTime: number) {
    super(EscapeComponent.KEY);
    this.chanceOfEscape = chanceOfEscape;
    this.minCaptureTime = minCaptureTime;
  }

  public onAttach(entity: Entity) {
    super.onAttach(entity);

    this._jailedAt = Date.now();
    this._catMeta = <CatMetaComponent>
        entity.getComponent(CatMetaComponent.KEY);
  }

  public update(delta: number) {
    // Enforce remaining in prison for a specific amount of time
    // TODO: This should use the delta value (game time) instead of real time
    if (Date.now() < this._jailedAt + this.minCaptureTime) {
      return;
    }

    // If they are close to pickup, don't screw the player
    if (this._catMeta.howCloseToPickup > .89) {
      return;
    }

    // Cat has tried and failed
    if (Math.random() > this.chanceOfEscape) {
      return;
    }

    // Ninja cat has escaped!
    this._removeFromJail();
  }

  private _removeFromJail() {
    // Remove the jailed and escape component
    this.entity.getComponent(JailedComponent.KEY).deleted = true;
    this.entity.getComponent(EscapeComponent.KEY).deleted = true;

    // Move this entity outside the jailer entityhitBox
    const hitBox = (this.entity.getComponent(HitboxComponent.KEY) as HitboxComponent);

    hitBox.x = (Math.random() >= .5 ? (Game.WORLD_WIDTH / 2) - 100 : (Game.WORLD_WIDTH / 2) + 100);
    hitBox.y = (Game.WORLD_HEIGHT) - 50;
  }
}
