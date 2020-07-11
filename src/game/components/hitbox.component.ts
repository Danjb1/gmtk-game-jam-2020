import { Component } from '../component';
import { Game } from '../game';

export class HitboxComponent extends Component {

  public static readonly KEY = Symbol();

  // Speed, in units per second
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

    // Calculate change in position for this frame
    const dx = (this.speedX * delta) / 1000;
    const dy = (this.speedY * delta) / 1000;

    // Move the Entity
    this.x += dx;
    this.y += dy;

    // If the Entity moved, keep it in bounds
    if (this.speedX !== 0 || this.speedY !== 0) {
      this.gameBoundaryCollision();
    }
  }

  private gameBoundaryCollision() {
    if (this.x <= 0) {
      this.speedX = 0;
      this.x = 0;
    } else if ((this.x + this.width) >= Game.WORLD_WIDTH) {
      this.speedX = 0;
      this.x = Game.WORLD_WIDTH - this.width;
    }

    if (this.y <= 0) {
      this.speedY = 0;
      this.y = 0;
    } else if ((this.y + this.height) >= Game.WORLD_HEIGHT) {
      this.speedY = 0;
      this.y = Game.WORLD_HEIGHT - this.height;
    }
  }
}
