import { Entity } from '../entity';

// Components
import { Component } from '../component';
import { HitboxComponent } from '../components';
import { Input } from '../input';

export class ControllerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  constructor(private input: Input, private speed: number) {
    super(ControllerComponent.KEY);
  }

  onAttach(e: Entity): void {
    super.onAttach(e);
  }

  update(delta: number): void {

    // Detect current inputs
    const up = this.input.isPressed(Input.UP);
    const down = this.input.isPressed(Input.DOWN);
    const left = this.input.isPressed(Input.LEFT);
    const right = this.input.isPressed(Input.RIGHT);

    // Determine how entity should move
    let speedX = 0;
    let speedY = 0;

    if (up && !down) {
      speedY = -1 * this.speed;
    } else if (!up && down) {
      speedY = this.speed;
    }

    if (left && !right) {
      speedX = -1 * this.speed;
    } else if (!left && right) {
      speedX = this.speed;
    }

    // Apply speeds to hitbox
    this.hitbox.speedX = speedX;
    this.hitbox.speedY = speedY;
  }

  onSpawn(): void {
    this.hitbox = <HitboxComponent> this.entity.getComponent(HitboxComponent.KEY);
  }
}
