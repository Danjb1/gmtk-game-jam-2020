import { Component } from '../component';

export class HitboxComponent extends Component {

  public static readonly KEY = Symbol();

  public speedX = 0;
  public speedY = 0;

  constructor(
      public x: number,
      public y: number,
      public width: number,
      public height: number) {
    super(HitboxComponent.KEY);
  }

  public update(delta: number): void {
    this.x += this.speedX;
    this.y += this.speedY;
  }

}
