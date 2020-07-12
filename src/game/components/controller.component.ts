import { Entity } from '../entity';

// Components
import { Component } from '../component';
import { HitboxComponent } from '../components';
import { Input } from '../input';

// Utils
import { getHitboxFrom, Vector } from '../utils';

export class ControllerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  constructor(private input: Input, private speed: number) {
    super(ControllerComponent.KEY);
  }

  public onAttach(e: Entity): void {
    super.onAttach(e);
  }

  public update(delta: number): void {
    this.hitbox.setSpeed(
      new Vector(
        this.getAxisSpeed(Input.LEFT, Input.RIGHT),
        this.getAxisSpeed(Input.UP, Input.DOWN)
      ).capMagnitude(this.speed)
    );
  }

  private getAxisSpeed(positiveName: String, negativeName: String): number {
    const positive = this.input.isPressed(positiveName);
    const negative = this.input.isPressed(negativeName);
    let speed = 0;
    if (positive && !negative) {
      speed = -1 * this.speed;
    } else if (!positive && negative) {
      speed = this.speed;
    }
    return speed;
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }
}
