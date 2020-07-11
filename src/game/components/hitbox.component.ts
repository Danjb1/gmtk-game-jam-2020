import { Component } from '../component';

export class HitboxComponent extends Component {

  public speedX: number;
  public speedY: number;

  constructor(
      public x: number,
      public y: number,
      public width: number,
      public height: number) {
    super();
  }

  update(delta: number): void {
    this.x += this.speedX;
    this.y += this.speedY;
  }

}
