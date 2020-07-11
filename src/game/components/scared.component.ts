import { Component } from '../component';
import { Entity } from '../entity';

// Components
import { ScarerComponent } from './scarer.component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getDistanceBetween } from '../utils/geometry';

/**
 * Will cause the holding Entity to flee from other Entities which have a
 * ScarerComponent, when they get too close.
 */
export class ScaredComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private frightDistance = 100;
  private speed = 300;

  constructor() {
    super(ScaredComponent.KEY);
  }

  onSpawn(): void {
    this.hitbox = this.extractHitbox(this.entity);
  }

  update(): void {

    // Locate Entities in the world which are Scarers
    const scarers = this.entity.entityContext
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
      const scarerHitbox = this.extractHitbox(actualScarers[0]);
      console.log('AAAAAH!!');
      // TODO: move away from it
    }
  }

  /**
   * Gets the distance from the parent Entity to another Entity.
   */
  private getRangeTo(otherEntity: Entity): number {
    return getDistanceBetween(
      this.hitbox,
      this.extractHitbox(otherEntity)
    );
  }

  /**
   * Gets the HitboxComponent from an Entity, if it has one.
   */
  private extractHitbox(entity: Entity): HitboxComponent {
    return <HitboxComponent> entity.getComponent(HitboxComponent.KEY);
  }
}