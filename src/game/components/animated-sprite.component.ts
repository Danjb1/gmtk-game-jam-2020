import * as PIXI from 'pixi.js';

import { Component } from '../component';
import { Assets } from '../assets';
import { HitboxComponent } from './hitbox.component';

export class AnimatedSpriteComponent extends Component {

  public static readonly KEY = Symbol();

  private sprite: PIXI.Sprite;
  private hitbox: HitboxComponent;

  constructor(
    filename: string,
  ) {
    super(AnimatedSpriteComponent.KEY);

    const spritesheet = Assets.spritesheet();
    this.sprite = new PIXI.AnimatedSprite(spritesheet.animations[filename]);
  }

  public onSpawn(): void {

    // Register this Sprite with Pixi
    this.entity.context.getViewport().addChild(this.sprite);

    // Retrieve the Hitbox from the Entity
    this.hitbox = <HitboxComponent>
      this.entity.getComponent(HitboxComponent.KEY);

    this.snapToEntity();
  }

  public update(delta: number): void {
    this.snapToEntity();
  }

  private snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.sprite.x = this.hitbox.x;
    this.sprite.y = this.hitbox.y;
    this.sprite.width = this.hitbox.width;
    this.sprite.height = this.hitbox.height;
  }

}
