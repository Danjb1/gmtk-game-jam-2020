import { Entity } from '../entity';
import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';
import { getHitboxFrom, Vector } from '../utils';

/**
 * Component representing a journey to a destination.
 */
export class JourneyComponent extends Component {

  static readonly KEY = Symbol();

  private rangeThreshold = 10;

  private hitbox: HitboxComponent;

  constructor(private speed: number, private destination: Vector) {
    super(JourneyComponent.KEY);
  }

  onAttach(e: Entity): void {
    this.entity = e;
    this.hitbox = getHitboxFrom(this.entity);
  }

  update(delta: number) {

    // Figure out how long is left
    const position = this.hitbox.centrePosition;
    const path = Vector.between(position, this.destination);
    const rangeToDestination = path.magnitude;

    // If we are within a margin of error, stop here
    if (rangeToDestination < this.rangeThreshold) {
      this.cease();
      return;
    }

    // Move towards the destination
    this.hitbox.setSpeed(path.scaleToMagnitude(this.speed));
  }

  cease(): void {
    this.hitbox.setSpeed(Vector.zero());
    this.deleted = true;
  }
}
