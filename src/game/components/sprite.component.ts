import * as PIXI from 'pixi.js';

import { Component } from '../component';
import { Assets } from '../assets';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getHitboxFrom } from '../utils';

export class SpriteComponent extends Component {

  public static readonly KEY = Symbol();

  private sprite: PIXI.Sprite;
  private hitbox: HitboxComponent;

  constructor(
    filename: string,
    spriteSettings?: any,
    tiled?: boolean,
  ) {
    super(SpriteComponent.KEY);

    const texture = Assets.texture(filename);
    this.sprite = tiled
      ? new PIXI.TilingSprite(texture)
      : new PIXI.Sprite(texture);

    if (spriteSettings) {
      this.sprite = Object.assign(this.sprite, spriteSettings);
    }
  }

  public onSpawn(): void {

    // Register this Sprite with Pixi
    const viewport = this.entity.context.getViewport();
    viewport.addChild(this.sprite);
    viewport.sortChildren();

    // Retrieve the Hitbox from the Entity
    this.hitbox = getHitboxFrom(this.entity);

    this.snapToEntity();
  }

  public destroy(): void {
    this.entity.context.getViewport().removeChild(this.sprite);
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

}
