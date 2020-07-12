import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getHitboxFrom, intBetween, randomSign, Vector } from '../utils';

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

  constructor(wanderingBehavior: any) {
    super(WanderComponent.KEY);
    this.chanceToWander = wanderingBehavior.chance;
    this.minWanderSpeed = wanderingBehavior.minSpeed;
    this.maxWanderSpeed = wanderingBehavior.maxSpeed;
    this.minWanderTime = wanderingBehavior.minTime;
    this.maxWanderTime = wanderingBehavior.maxTime;
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  public update(delta: number): void {

    if (this.isWandering()) {
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
   * Starts a random wander.
   */
  private startWandering(): void {

    // Random speed
    this.hitbox.setSpeed(new Vector(
      randomSign() * intBetween(this.minWanderSpeed, this.maxWanderSpeed),
      randomSign() * intBetween(this.minWanderSpeed, this.maxWanderSpeed)
    ));

    // Random time
    this.wanderTimeRemaining = intBetween(
      this.minWanderTime,
      this.maxWanderTime
    );
  }

}
