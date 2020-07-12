import { Component } from '../component';
import { Entity } from '../entity';
import { HitboxComponent } from './hitbox.component';
import { JailerComponent } from './jailer.component';
import { isJailed, hasJourney } from '../utils/entity-utils';

// Utils
import {
  getRangeBetweenEntities,
  getHitboxFrom,
  intBetween,
  randomSign,
  Vector
} from '../utils';

export class WanderComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  /**
   * Chance to start wandering each frame.
   *
   * 0.0166666 is once per second, on average.
   */
  private chanceToWander = 0.05;

  /**
   * Minimum x/y speed when wandering.
   */
  private minWanderSpeed = 100;

  /**
   * Maximum x/y speed when wandering.
   */
  private maxWanderSpeed: number;

  /**
   * Minimum time to wander, in ms.
   */
  private minWanderTime = 200;

  /**
   * Maximum time to wander, in ms.
   */
  private maxWanderTime = 500;

  /**
   * Time remaining of the current wander.
   */
  private wanderTimeRemaining = 0;

  /**
   * The closest we can approach a Jailer without avoiding it.
   */
  private avoidJailerDistance = 150;

  constructor(wanderingBehavior: any) {
    super(WanderComponent.KEY);
    this.chanceToWander = wanderingBehavior.chance;
    this.minWanderSpeed = wanderingBehavior.minSpeed;
    this.maxWanderSpeed = wanderingBehavior.maxSpeed;
    this.minWanderTime = wanderingBehavior.minTime;
    this.maxWanderTime = wanderingBehavior.maxTime;
    this.avoidJailerDistance = wanderingBehavior.avoidJailerDistance;
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  public update(delta: number): void {
    if (hasJourney(this.entity)) {
      // Do not wander if we have a specific destination
      return;
    } else if (this.isWandering()) {
      this.wanderFor(delta);
    } else if (this.shouldWander()) {
      this.startWandering();
    }
  }

  /**
   * Determines if a wander is in progress.
   */
  private isWandering(): boolean {
    return this.wanderTimeRemaining > 0;
  }

  /**
   * Applies some time to the current wander.
   */
  private wanderFor(delta: number): void {
    this.wanderTimeRemaining -= delta;

    if (this.wanderTimeRemaining <= 0) {
      this.stopWandering();
    }
  }

  /**
   * Ends any wandering.
   */
  private stopWandering(): void {
    this.wanderTimeRemaining = 0;
    this.hitbox.setSpeed(Vector.zero());
  }

  /**
   * Determines whether to begin a new wander.
   */
  private shouldWander(): boolean {
    return Math.random() < this.chanceToWander;
  }

  /**
   * Starts a random wander, avoiding nearby Jailers. Note that we only avoid
   * Jailers if we are not already in jail.
   */
  private startWandering(): void {

    // Set random wander time
    this.wanderTimeRemaining = intBetween(this.minWanderTime, this.maxWanderTime);

    if (!isJailed(this.entity)) {

      // Check for nearby Jailers
      const jailers = this.entity.context
        .getEntities()
        .filter(entity => entity.getComponent<JailerComponent>(JailerComponent.KEY))
        .filter(entity => this.isWithinAvoidDistance(entity))
        .sort((a, b) => this.sortNearest(a, b));

      if (jailers.length > 0) {

        // Figure out where nearest jailer is
        const jailerPosition = getHitboxFrom(jailers[0]).centrePosition;
        const xSign = jailerPosition.x < this.hitbox.centerX ? 1 : -1;
        const ySign = jailerPosition.y < this.hitbox.centerY ? 1 : -1;

        // Wander away from jailer, at random speed
        this.hitbox.setSpeed(this.getWanderVector(xSign, ySign));
        return;
      }
    }

    // If we are in jail or far away from it, set random wander vector
    this.hitbox.setSpeed(this.getRandomWanderVector());
  }

  private isWithinAvoidDistance(entity: Entity): boolean {
    return getRangeBetweenEntities(this.entity, entity) < this.avoidJailerDistance;
  }

  /**
   * Comparator to sort two entities by which is closest to our one.
   */
  private sortNearest(a: Entity, b: Entity): number {
    const aDistance = getRangeBetweenEntities(this.entity, a);
    const bDistance = getRangeBetweenEntities(this.entity, b);

    if (aDistance < bDistance) {
      return -1;
    } else if (bDistance < aDistance) {
      return 1;
    } else {
      return 0;
    }
  }

  private getRandomWanderVector(): Vector {
    return this.getWanderVector(randomSign(), randomSign());
  }

  private getWanderVector(xSign: number, ySign: number): Vector {
    return new Vector(
      xSign * intBetween(this.minWanderSpeed, this.maxWanderSpeed),
      ySign * intBetween(this.minWanderSpeed, this.maxWanderSpeed)
    );
  }

}
