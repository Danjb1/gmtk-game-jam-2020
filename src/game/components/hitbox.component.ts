import { Component } from '../component';

export class HitboxComponent extends Component {

  public speedX = 0;
  public speedY = 0;

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
