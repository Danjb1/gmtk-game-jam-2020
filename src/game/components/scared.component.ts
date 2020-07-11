import { Component } from '../component';
import { Entity } from '../entity';

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
  private frightDistance = 120;
  private speed = 250;

  constructor() {
    super(ScaredComponent.KEY);
  }

  onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  update(delta: number): void {

    // Locate Entities in the world which are Scarers
    const scarers = this.entity.context
      .getEntities()
      .filter(e => e.getComponent(ScarerComponent.KEY) !== undefined);

    // Find the closest one which is near enough to worry about, if any.
    // N.B. If we expected to have multiple scarers, this could be improved.
    const actualScarers = scarers
      .filter(scarer => this.getRangeTo(scarer) < this.frightDistance)
      .sort((a, b) => {
        const aRange = this.getRangeTo(a);
        const bRange = this.getRangeTo(b);

        if (aRange < bRange) {
          return -1;
        } else if (bRange > aRange) {
          return 1;
        } else {
          return 0;
        }
      });

    // If there is one, plot a course away from it
    if (actualScarers.length > 0) {
      const scarerHitbox = getHitboxFrom(actualScarers[0]);

      // Work out distance vector to scarer
      const deltaX = scarerHitbox.x - this.hitbox.x;
      const deltaY = scarerHitbox.y - this.hitbox.y;

      // Calculate proper scale for new vector
      const factor = this.speed / getDistanceBetween(this.hitbox, scarerHitbox);

      // Calculate new vector
      this.hitbox.speedX = -1 * deltaX * factor;
      this.hitbox.speedY = -1 * deltaY * factor;
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
