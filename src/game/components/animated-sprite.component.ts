import * as PIXI from 'pixi.js';

import { Assets } from '../assets';

import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getHitboxFrom } from '../utils';

type Direction = 'up' | 'down' | 'left' | 'right';

export class AnimatedSpriteComponent extends Component {
  public static readonly KEY = Symbol();

  private sprite: PIXI.AnimatedSprite;
  private hitbox: HitboxComponent;
  private spritesheet: PIXI.Spritesheet;

  constructor(
    private filename: string
  ) {
    super(AnimatedSpriteComponent.KEY);
    this.spritesheet = Assets.spritesheet();
    this.sprite = new PIXI.AnimatedSprite(this.spritesheet.animations[`${filename}_down`]);
  }

  public onSpawn(): void {
    this.sprite.animationSpeed = 0.2;
    this.sprite.play();

    // Register this Sprite with Pixi
    this.entity.context
      .getViewport()
      .addChild(this.sprite);

    // Retrieve the Hitbox from the Entity
    this.hitbox = getHitboxFrom(this.entity);

    this.snapToEntity();
  }

  public update(delta: number): void {
    this.updateDirection();
    if (this.hitbox.speedX === 0 && this.hitbox.speedY === 0) {
      this.sprite.stop();
    } else {
      this.sprite.play();
    }
    this.snapToEntity();
  }

  private snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.sprite.x = this.hitbox.x;
    this.sprite.y = this.hitbox.y;
    this.sprite.width = this.hitbox.width;
    this.sprite.height = this.hitbox.height;
  }

  private updateDirection() {
    let newDirection: Direction;
    if (this.sprite.x > this.hitbox.x) {
      newDirection = 'left';
    } else if (this.sprite.x < this.hitbox.x) {
      newDirection = 'right';
    } else if (this.sprite.y > this.hitbox.y) {
      newDirection = 'up';
    } else if (this.sprite.y < this.hitbox.y) {
      newDirection = 'down';
    } else {
      return;
    }

    // Update the texture
    this.sprite.destroy();
    this.sprite = new PIXI.AnimatedSprite(
      this.spritesheet.animations[`${this.filename}_${newDirection}`]
    );
    this.entity.context
      .getViewport()
      .addChild(this.sprite);
  }

}
