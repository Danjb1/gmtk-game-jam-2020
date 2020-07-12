import { Vector } from '../utils';
import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';

/**
 * Component representing a journey to a destination.
 */
export class JourneyComponent extends Component {

  static readonly KEY = Symbol();

  private rangeThreshold = 10;

  private hitbox: HitboxComponent;

  constructor(private maxSpeed: number, private destination: Vector) {
    super(JourneyComponent.KEY);
  }

  update(delta: number) {

    // Figure out how long is left
    const rangeToDestination =
      this.destination.hypotenuse(this.hitbox.centrePosition);

    // If we are within a margin of error, stop here
    if (rangeToDestination < this.rangeThreshold) {
      this.deleted = true;
      return;
    }

    // If we will cover this distance in less than one frame, adjust speed
    // TODO
  }
}
