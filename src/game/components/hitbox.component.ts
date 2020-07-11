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

  get right(): number {
    return this.x + this.width;
  }

  get bottom(): number {
    return this.y + this.height;
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

  public collidedWith(other: HitboxComponent) {
    console.log("Entities collided", this, other);
    // TODO: Call 'onCollision' event
  }

  // https://github.com/kittykatattack/learningPixi#the-hittestrectangle-function
  public get halfWidth(): number { return this.width / 2; }
  public get halfHeight(): number { return this.height / 2; }
  public get centerX(): number { return this.x + this.halfWidth; }
  public get centerY(): number { return this.y + this.halfHeight; }

  public intersects(other: HitboxComponent): boolean {

    //Define the variables we'll need to calculate
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;
  
    //hit will determine whether there's a collision
    hit = false;
  
    //Calculate the distance vector between the sprites
    vx = this.centerX - other.centerX;
    vy = this.centerY - other.centerY;
  
    //Figure out the combined half-widths and half-heights
    combinedHalfWidths = this.halfWidth + other.halfWidth;
    combinedHalfHeights = this.halfHeight + other.halfHeight;
  
    //Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {
  
      //A collision might be occurring. Check for a collision on the y axis
      if (Math.abs(vy) < combinedHalfHeights) {
  
        //There's definitely a collision happening
        hit = true;
      } else {
  
        //There's no collision on the y axis
        hit = false;
      }
    } else {
  
      //There's no collision on the x axis
      hit = false;
    }
  
    return hit;
  };
  
  private gameBoundaryCollision(): void {
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
