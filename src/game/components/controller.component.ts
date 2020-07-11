import { Entity } from '../entity';

// Components
import { Component } from '../component';
import { HitboxComponent } from '../components';
import { Input } from '../input';

export class ControllerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  constructor(private input: Input) {
    super(ControllerComponent.KEY);
  }

  onAttach(e: Entity): void {
    super.onAttach(e);
  }

  update(delta: number): void {}

  onSpawn(): void {
    this.hitbox = <HitboxComponent> this.entity.getComponent(HitboxComponent.KEY);
  }
}
