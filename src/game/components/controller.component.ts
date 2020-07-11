import { Component } from '../component';
import { Entity } from '../entity';

export class ControllerComponent extends Component {

  // Movement axis names
  public static readonly UP_NAME = 'Up';
  public static readonly DOWN_NAME = 'Down';
  public static readonly LEFT_NAME = 'Left';
  public static readonly RIGHT_NAME = 'Right';

  public static readonly KEY = Symbol();

  constructor() {
    super(ControllerComponent.KEY);
  }

  onAttach(e: Entity): void {
    super.onAttach(e);
  }

  update(delta: number): void {}

  onSpawn(): void {}
}
