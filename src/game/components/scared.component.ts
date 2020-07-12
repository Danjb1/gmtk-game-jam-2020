import { Component } from '../component';
import { Entity } from '../entity';
import { Game } from '../game';

// Components
import { ScarerComponent } from './scarer.component';
import { HitboxComponent } from './hitbox.component';

// Utils
import {
  getHitboxFrom,
  getRangeBetweenEntities,
  Vector,
  isJailed
} from '../utils';

/**
 * Will cause the holding Entity to flee from other Entities which have a
 * ScarerComponent, when they get too close.
 */
export class ScaredComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private flightDistance = 100;
  private flightSpeed = 330;

  constructor(flightDistance: number, flightSpeed: number) {
    super(ScaredComponent.KEY);
  }

  onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  update(delta: number): void {

    // Do not be scared, if we are in jail
    if (isJailed(this.entity)) {
      return;
    }

    const scarers = this.getScarers();

    if (scarers.length > 0) {
      const scarerHitboxes = scarers.map(scarer => getHitboxFrom(scarer));

      // Sum vectors to all scarers
      let fleeVector = Vector.zero();
      scarerHitboxes.forEach(scarerHitbox => {
        fleeVector = fleeVector.plus(
          Vector.between(
            this.hitbox.centrePosition, scarerHitbox.centrePosition
        ));
      });

      // Scale flee vector to speed and point away from scarers on average
      fleeVector = fleeVector.scaleToMagnitude(-1 * this.flightSpeed);

      // Correct flee vector towards centre of screen
      // (this is to prevent us getting stuck on a wall or in a corner)
      this.hitbox.setSpeed(
        fleeVector
          .plus(this.getCentreScreenVector())
          .scaleToMagnitude(this.flightSpeed)
      );
    }
  }

  /**
   * Gets all Entities within fright distance.
   */
  private getScarers(): Entity[] {
    return this.entity.context
      .getEntities()
      .filter(entity => entity.getComponent(ScarerComponent.KEY) !== undefined)
      .filter(scarer => getRangeBetweenEntities(this.entity, scarer) < this.flightDistance);
  }

  /**
   * Get a vector pointing to the centre of the screen, scaled proportionately
   * to the distance from it.
   */
  private getCentreScreenVector(): Vector {
    const centreScreen = new Vector(Game.WORLD_WIDTH / 2, Game.WORLD_HEIGHT / 2);
    return centreScreen.minus(this.hitbox.centrePosition);
  }
}
