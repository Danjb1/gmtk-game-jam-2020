import { Entity } from '../entity';
import { Game } from '../game';
import { Component } from '../component';

// Components
import { CatMetaComponent } from './cat-meta.component';
import { JailedComponent } from './jailed.component';

// Utils
import { getHitboxFrom } from '../utils';


export class EscapeComponent extends Component {

  private _jailedAt: number;
  private _catMeta: CatMetaComponent;
  private lastCheck: number;

  public static readonly KEY = Symbol();

  constructor(
    private chanceOfEscape = 0.005,
    private minCaptureTime = 500,
    private escapeAttemptFrequency = 20
    ) {
    super(EscapeComponent.KEY);
  }

  public onAttach(entity: Entity) {
    super.onAttach(entity);

    this._jailedAt = Date.now();
    this._catMeta = entity.getComponent<CatMetaComponent>(CatMetaComponent.KEY);
  }

  public update(delta: number) {
    const now = Date.now();
    // Enforce remaining in prison for a specific amount of time
    if (now < this._jailedAt + this.minCaptureTime) {
      return;
    }

    // If they are close to pickup, don't screw the player
    if (this._catMeta.howCloseToPickup > .89) {
      return;
    }

    // Only check every "tryEscapeEvery" ms
    if(this.lastCheck + this.escapeAttemptFrequency > now){
      return;
    }

    // Cat has tried and failed to escape
    if (Math.random() > this.chanceOfEscape) {
      this.lastCheck = now;
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
    const hitBox = getHitboxFrom(this.entity);

    hitBox.x = (Math.random() >= .5 ? (Game.WORLD_WIDTH / 2) - 100 : (Game.WORLD_WIDTH / 2) + 100);
    hitBox.y = (Game.WORLD_HEIGHT) - 50;

    // Notify components
    this.entity.broadcast('escaped');
  }
}
