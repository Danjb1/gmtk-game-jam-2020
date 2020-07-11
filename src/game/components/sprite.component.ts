import * as PIXI from 'pixi.js';
import { Component } from '../component';
import { Entity } from '../entity';
import { Assets } from '../assets';
import { HitboxComponent } from './hitbox.component';

export class SpriteComponent extends Component {

  private sprite: PIXI.Sprite;
  private hitbox: HitboxComponent;

  constructor(
      filename: string,
      private stage: PIXI.Container) {
    super();

    const texture = Assets.texture(filename);
    this.sprite = new PIXI.Sprite(texture);
  }

  onAttach(e: Entity) {
    super.onAttach(e);

    // Retrieve the Hitbox from the Entity
    this.hitbox = <HitboxComponent>
        e.getComponent((c: Component) => c instanceof HitboxComponent);

    // Register this Sprite with Pixi
    this.stage.addChild(this.sprite);

    this.snapToEntity();
  }

  update(delta: number): void {
    this.snapToEntity();
  }

  snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.sprite.x = this.hitbox.x;
    this.sprite.y = this.hitbox.y;
  }

}
