import { Component } from '../component';
import { Game } from '../game';
import { Vector } from '../utils';
import { abortJourney, getCollisionEdge } from '../utils';

export enum Edge {
  TOP,
  LEFT,
  BOTTOM,
  RIGHT
}

export interface HitboxListener {

  hitboxCollided: (other: HitboxComponent) => void;

}

export interface HitboxProperties {

  /**
   * List of tags that are blocked by this Hitbox.
   */
  blocks?: string[];

  /**
   * Tags that apply to this Hitbox.
   */
  tags?: string[];

}

export class HitboxComponent extends Component {
  public static readonly KEY = Symbol();

  // Previous position
  public prevX: number;
  public prevY: number;

  // Speed, in units per second
  public speedX = 0;
  public speedY = 0;

  private listeners: HitboxListener[] = [];

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public props?: HitboxProperties) {
    super(HitboxComponent.KEY);

    this.prevX = x;
    this.prevY = y;

    // Ensure props are populated
    this.props = {
      blocks: [],
      tags: [],
      ...props,
    };
  }

  public destroy(): void {
    // Clear listeners to prevent any dangling references
    this.listeners = [];
  }

  public update(delta: number): void {

    // Remember the position before any movement takes place.
    // This comes in handy during collision handling.
    this.prevX = this.x;
    this.prevY = this.y;

    // Calculate change in position for this frame
    const dx = (this.speedX * delta) / 1000;
    const dy = (this.speedY * delta) / 1000;

    // Move the Entity
    this.x += dx;
    this.y += dy;

    // If the Entity moved, keep it in bounds
    if (this.speedX !== 0 || this.speedY !== 0) {
      this.checkBounds();
    }
  }

  public addListener(listener: HitboxListener): void {
    this.listeners.push(listener);
  }

  public removeListener(listener: HitboxListener): void {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  //////////////////////////////////////////////////////////////////////////////
  // Field Access
  //////////////////////////////////////////////////////////////////////////////

  get right(): number {
    return this.x + this.width;
  }

  get bottom(): number {
    return this.y + this.height;
  }

  get centrePosition(): Vector {
    return new Vector(this.centerX, this.centerY);
  }

  get halfWidth(): number {
    return this.width / 2;
  }

  get halfHeight(): number {
    return this.height / 2;
  }

  get centerX(): number {
    return this.x + this.halfWidth;
  }

  get centerY(): number {
    return this.y + this.halfHeight;
  }

  setSpeed(speed: Vector): void {
    this.speedX = speed.x;
    this.speedY = speed.y;
  }

  //////////////////////////////////////////////////////////////////////////////
  // Collisions
  //////////////////////////////////////////////////////////////////////////////

  // https://github.com/kittykatattack/learningPixi#the-hittestrectangle-function
  public intersects(other: HitboxComponent): boolean {

    // Calculate the distance vector between the sprites
    const vx = this.centerX - other.centerX;
    const vy = this.centerY - other.centerY;

    // Figure out the combined half-widths and half-heights
    const combinedHalfWidths = this.halfWidth + other.halfWidth;
    const combinedHalfHeights = this.halfHeight + other.halfHeight;

    // Check for a collision on the x axis
    if (Math.abs(vx) < combinedHalfWidths) {

      // A collision might be occurring - check for a collision on the y axis
      return Math.abs(vy) < combinedHalfHeights;

    }

    return false;
  }

  private checkBounds(): void {
    if (this.x <= 0) {
      this.speedX = 0;
      this.x = 0;
    } else if (this.right >= Game.WORLD_WIDTH) {
      this.speedX = 0;
      this.x = Game.WORLD_WIDTH - this.width;
    }

    if (this.y <= Game.WORLD_TOP) {
      this.speedY = 0;
      this.y = Game.WORLD_TOP;
    } else if (this.bottom >= Game.WORLD_HEIGHT) {
      this.speedY = 0;
      this.y = Game.WORLD_HEIGHT - this.height;
    }
  }

  public collidedWith(other: HitboxComponent): void {
    if (this.shouldBlock(other)) {
      this.block(other);
      return;
    }
    this.listeners.forEach(l => l.hitboxCollided(other));
  }

  private shouldBlock(other: HitboxComponent): boolean {
    // Is this Hitbox set to block any tags of the other Hitbox?
    return !!this.props.blocks.find(tag => other.props.tags.includes(tag));
  }

  /**
   * Blocks another Hitbox from intersecting this one.
   *
   * More specifically, this will move the given Hitbox OUT of this Hitbox,
   * based on which edge it collided with.
   */
  private block(other: HitboxComponent): void {

    // If the Hitbox's owner was on a journey, stop it
    abortJourney(other.entity);

    // Find the edge of THIS Hitbox that was collided with
    const collisionEdge: Edge = getCollisionEdge(other, this);

    // Move the colliding Entity to that edge
    if (collisionEdge === Edge.TOP) {
      other.y = this.y - other.height;
      other.speedY = 0;
    } else if (collisionEdge === Edge.BOTTOM) {
      other.y = this.bottom;
      other.speedY = 0;
    } else if (collisionEdge === Edge.LEFT) {
      other.x = this.x - other.width;
      other.speedX = 0;
    } else if (collisionEdge === Edge.RIGHT) {
      other.x = this.right;
      other.speedX = 0;
    }
  }

}
