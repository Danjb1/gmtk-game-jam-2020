import { Component } from '../component';
import { Entity } from '../entity';
import { Game } from '../game';
import { Vector } from '../vector';

// Components
import { ScarerComponent } from './scarer.component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getDistanceBetween, getHitboxFrom } from '../utils';

/**
 * Will cause the holding Entity to flee from other Entities which have a
 * ScarerComponent, when they get too close.
 */
export class ScaredComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private frightDistance = 100;
  private speed = 330;

  constructor() {
    super(ScaredComponent.KEY);
  }

  onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  update(delta: number): void {
    const scarer = this.getScarer();

    if (scarer) {
      const scarerHitbox = getHitboxFrom(scarer);

      // Plot course away from scarer
      const fleeVector = Vector
        .between(this.hitbox.centrePosition, scarerHitbox.centrePosition)
        .scaleToMagnitude(-1 * this.speed);

      // Correct flee vector towards centre of screen
      // (this is to prevent us getting stuck on a wall or in a corner)
      this.hitbox.setSpeed(
        fleeVector
          .plus(this.getCentreScreenVector().multiply(0.75))
          .scaleToMagnitude(this.speed)
      );
    }
  }

  /**
   * Gets the closest Entity which is a Scarer, provided there is one within the
   * frightDistance.
   */
  private getScarer(): Entity {
    const scarers = this.entity.context
      .getEntities()
      .filter(e => e.getComponent(ScarerComponent.KEY) !== undefined)
      .filter(scarer => this.getRangeTo(scarer) < this.frightDistance)
      .sort((a, b) => this.sortEntitiesByDistance(a, b));
    return scarers.length > 0 ? scarers[0] : null;
  }

  /**
   * Get a vector pointing to the centre of the screen, scaled proportionately
   * to the distance from it.
   */
  private getCentreScreenVector(): Vector {
    const centreScreen = new Vector(Game.WORLD_WIDTH / 2, Game.WORLD_HEIGHT / 2);
    return centreScreen.minus(this.hitbox.centrePosition);
  }

  /**
   * Comparator for two Entities, sorting by the one closest to the Entity that
   * holds this Component.
   */
  private sortEntitiesByDistance(a: Entity, b: Entity): number {
    const aRange = this.getRangeTo(a);
    const bRange = this.getRangeTo(b);
    if (aRange < bRange) {
      return -1;
    } else if (bRange > aRange) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Gets the distance from the parent Entity to another Entity.
   */
  private getRangeTo(otherEntity: Entity): number {
    return getDistanceBetween(
      this.hitbox,
      getHitboxFrom(otherEntity)
    );
  }
}
