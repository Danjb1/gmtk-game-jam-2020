import * as PIXI from 'pixi.js';
import { Component } from '../component';
import { Entity } from '../entity';
import { Assets } from '../assets';
import { HitboxComponent } from './hitbox.component';

export class SpriteComponent extends Component {

  public static readonly KEY = Symbol();

  private sprite: PIXI.Sprite;
  private hitbox: HitboxComponent;

  constructor(
      filename: string,
      private stage: PIXI.Container) {
    super(SpriteComponent.KEY);

    const texture = Assets.texture(filename);
    this.sprite = new PIXI.Sprite(texture);
  }

  onAttach(e: Entity) {
    super.onAttach(e);

    // Register this Sprite with Pixi
    this.stage.addChild(this.sprite);
  }

  onSpawn() {

    // Retrieve the Hitbox from the Entity
    this.hitbox = <HitboxComponent>
        this.entity.getComponent(HitboxComponent.KEY);

    this.snapToEntity();
  }

  update(delta: number): void {
    this.snapToEntity();
  }

  snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.sprite.x = this.hitbox.x;
    this.sprite.y = this.hitbox.y;
    this.sprite.width = this.hitbox.width;
    this.sprite.height = this.hitbox.height;
  }

}
