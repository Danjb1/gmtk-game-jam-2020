import * as PIXI from 'pixi.js';

import { Assets } from '../assets';

import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getHitboxFrom } from '../utils';

type Direction = 'up' | 'down' | 'left' | 'right' | 'right_down' | 'right_up' | 'left_down' | 'left_up';

export class AnimatedSpriteComponent extends Component {
  public static readonly KEY = Symbol();

  private sprite: PIXI.AnimatedSprite;
  private hitbox: HitboxComponent;
  private spritesheet: PIXI.Spritesheet;
  private direction: Direction = 'down';

  constructor(
    private filename: string,
    private spriteSettings?: any
  ) {
    super(AnimatedSpriteComponent.KEY);
    this.spritesheet = Assets.spritesheet();
  }

  public onSpawn(): void {

    this.createSprite();

    // Retrieve the Hitbox from the Entity
    this.hitbox = getHitboxFrom(this.entity);

    this.snapToEntity();
  }

  private createSprite(): void {

    this.sprite = new PIXI.AnimatedSprite(
      this.spritesheet.animations[`${this.filename}_${this.direction}`]
    );

    this.sprite.animationSpeed = 2;

    if (this.spriteSettings) {
      this.sprite = Object.assign(this.sprite, this.spriteSettings);
    }

    this.sprite.play();

    // Register this Sprite with Pixi
    const viewport = this.entity.context.getViewport();
    viewport.addChild(this.sprite);
    viewport.sortChildren();
  }

  public destroy(): void {
    this.entity.context.getViewport().removeChild(this.sprite);
  }

  public update(delta: number): void {
    this.updateDirection();
    if (this.hitbox.speedX === 0 && this.hitbox.speedY === 0) {
      this.sprite.stop();
    } else if (!this.sprite.playing) {
      this.sprite.play();
    }
  }

  public lateUpdate(delta: number): void {
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
      if (this.sprite.y < this.hitbox.y) {
        newDirection = 'left_down'
      } else if (this.sprite.y > this.hitbox.y) {
        newDirection = 'left_up'
      } else {
        newDirection = 'left';
      }
    } else if (this.sprite.x < this.hitbox.x) {
      if (this.sprite.y < this.hitbox.y) {
        newDirection = 'right_down'
      } else if (this.sprite.y > this.hitbox.y) {
        newDirection = 'right_up'
      } else {
        newDirection = 'right';
      }
    } else if (this.sprite.y > this.hitbox.y) {
      newDirection = 'up';
    } else if (this.sprite.y < this.hitbox.y) {
      newDirection = 'down';
    } else {
      return;
    }

    if (newDirection !== this.direction) {
      this.direction = newDirection;
      // Update the texture
      this.sprite.destroy();
      this.createSprite();
    }
  }

}
