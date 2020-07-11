import { Component } from '../component';
import { Entity } from '../entity';
import { Game } from '../game';

// Components
import { ScarerComponent } from './scarer.component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getDistanceBetween, getHitboxFrom, Vector } from '../utils';

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
      fleeVector = fleeVector.scaleToMagnitude(-1 * this.speed);

      // Correct flee vector towards centre of screen
      // (this is to prevent us getting stuck on a wall or in a corner)
      this.hitbox.setSpeed(
        fleeVector
          .plus(this.getCentreScreenVector())
          .scaleToMagnitude(this.speed)
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
      .filter(scarer => this.getRangeTo(scarer) < this.frightDistance);
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
   * Gets the distance from the parent Entity to another Entity.
   */
  private getRangeTo(otherEntity: Entity): number {
    return getDistanceBetween(
      this.hitbox,
      getHitboxFrom(otherEntity)
    );
  }
}
