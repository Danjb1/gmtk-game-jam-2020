import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';
import { RandomUtils } from '../random.utils';

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
  private maxWanderSpeed = 200;

  /**
   * Minimum time to wander, in ms.
   */
  private minWanderTime = 100;

  /**
   * Maximum time to wander, in ms.
   */
  private maxWanderTime = 500;

  /**
   * Time remaining of the current wander.
   */
  private wanderTimeRemaining = 0;

  constructor() {
    super(WanderComponent.KEY);
  }

  public onSpawn(): void {
    this.hitbox = <HitboxComponent>
        this.entity.getComponent(HitboxComponent.KEY);
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
    this.hitbox.speedX = 0;
    this.hitbox.speedY = 0;
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
    this.hitbox.speedX = RandomUtils.randomSign() *
        RandomUtils.intBetween(this.minWanderSpeed, this.maxWanderSpeed);
    this.hitbox.speedY = RandomUtils.randomSign() *
        RandomUtils.intBetween(this.minWanderSpeed, this.maxWanderSpeed);

    // Random time
    this.wanderTimeRemaining = RandomUtils.intBetween(
        this.minWanderTime,
        this.maxWanderTime);
  }

}
