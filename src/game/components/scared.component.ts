import { Component } from '../component';
import { Entity } from '../entity';
import { ScarerComponent } from './scarer.component';
import { HitboxComponent } from './hitbox.component';
import { getDistanceBetween } from '../utils/geometry';

/**
 * Will cause the holding Entity to flee from other Entities which have a
 * ScarerComponent, when they get too close.
 */
export class ScaredComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private frightDistance = 100;
  private speed = 12;

  constructor() {
    super(ScaredComponent.KEY);
  }

  onSpawn(): void {
    this.hitbox = <HitboxComponent> this.entity.getComponent(HitboxComponent.KEY);
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
      console.log('AAAAAH');
      // TODO
    }
  }

  /**
   * Gets the distance from the parent Entity to another Entity.
   */
  getRangeTo(otherEntity: Entity): number {
    return getDistanceBetween(
      this.hitbox,
      <HitboxComponent> otherEntity.getComponent(HitboxComponent.KEY)
    );
  }
}