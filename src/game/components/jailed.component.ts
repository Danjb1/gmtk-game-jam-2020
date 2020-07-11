import { Component } from '../component';
import { JailerComponent } from '.';
import { Entity } from '../entity';
import { HitboxComponent } from './hitbox.component';
import { getHitboxFrom } from '../utils';

export class JailedComponent extends Component {

  public static readonly KEY = Symbol();

  public jailedTime: number;

  private hitbox: HitboxComponent;
  private jailerHitbox: HitboxComponent;

  constructor(private jailer: JailerComponent) {
    super(JailedComponent.KEY);
  }

  public onAttach(e: Entity): void {
    super.onAttach(e);

    this.jailerHitbox = getHitboxFrom(this.jailer.entity);
    this.hitbox = getHitboxFrom(e);

    // Put in jail!
    this.hitbox.x = this.jailerHitbox.centerX - this.hitbox.halfWidth;
    this.hitbox.y = this.jailerHitbox.centerY - this.hitbox.halfHeight;
    this.hitbox.speedX = 0;
    this.hitbox.speedY = 0;
  }

  public update(delta: number): void {
    this.jailedTime += delta;

    this.keepInJail();
  }

  private keepInJail(): void {
    if (this.hitbox.x < this.jailerHitbox.x) {
      this.hitbox.x = this.jailerHitbox.x;
      this.hitbox.speedX = 0;
    } else if (this.hitbox.right > this.jailerHitbox.right) {
      this.hitbox.x = this.jailerHitbox.right - this.hitbox.width;
      this.hitbox.speedX = 0;
    }
    if (this.hitbox.y < this.jailerHitbox.y) {
      this.hitbox.y = this.jailerHitbox.y;
      this.hitbox.speedY = 0;
    } else if (this.hitbox.bottom > this.jailerHitbox.bottom) {
      this.hitbox.y = this.jailerHitbox.bottom - this.hitbox.height;
      this.hitbox.speedY = 0;
    }
  }

  destroy() {
    this.jailer.removeEntityFromPrison(this.entity);
  }

}
