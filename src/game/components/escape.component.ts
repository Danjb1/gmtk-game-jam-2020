import { Entity } from '../entity';
import { Game } from '../game';
import { Component } from '../component';

// Components
import { CatMetaComponent } from './cat-meta.component';
import { JailedComponent } from './jailed.component';
import { HitboxComponent } from './hitbox.component';


export class EscapeComponent extends Component {

  // fraction: 1 = always escape, 0 = never escape
  private readonly CHANCE_OF_ESCAPE = .005;

  // Minimum time in prison, in milliseconds
  private readonly MINIMUM_TIME_IN_PRISON = 500;

  private _jailedAt: number;
  private _catMeta: CatMetaComponent;

  public static readonly KEY = Symbol();

  constructor() {
    super(EscapeComponent.KEY);
  }

  onAttach(entity: Entity) {
    super.onAttach(entity);
    this._jailedAt = Date.now();
    this._catMeta = entity.getComponent(CatMetaComponent.KEY) as CatMetaComponent;
  }

  update() {
    // Enforce remaining in prison for a specific amount of time
    if (Date.now() < this._jailedAt + this.MINIMUM_TIME_IN_PRISON) {
      return;
    }

    // If they are close to pickup, don't screw the player
    if (this._catMeta.howCloseToPickup > .89) {
      return;
    }

    // Cat has tried and failed
    if (Math.random() > this.CHANCE_OF_ESCAPE) {
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
