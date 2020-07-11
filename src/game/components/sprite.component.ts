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
    filename: string
  ) {
    super(SpriteComponent.KEY);

    const texture = Assets.texture(filename);
    this.sprite = new PIXI.Sprite(texture);
  }

  public onSpawn(): void {

    // Register this Sprite with Pixi
    this.entity.context.getViewport().addChild(this.sprite);

    // Retrieve the Hitbox from the Entity
    this.hitbox = getHitboxFrom(this.entity);

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
