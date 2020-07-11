import * as PIXI from 'pixi.js';
import { Component } from '../component';
import { Entity } from '../entity';
import { Assets } from '../assets';

export class SpriteComponent extends Component {

  private sprite: PIXI.Sprite;

  constructor(
      filename: string,
      private stage: PIXI.Container) {
    super();

    const texture = Assets.texture(filename);
    this.sprite = new PIXI.Sprite(texture);
  }

  onAttach(e: Entity) {
    super.onAttach(e);

    this.stage.addChild(this.sprite);
    
    this.snapToEntity();
  }

  update(delta: number): void {
    this.snapToEntity();
  }

  snapToEntity(): void {
    // TODO: need to get the Hitbox from the Entity
    //this.sprite.x = this.entity.x;
    //this.sprite.y = this.entity.y;
  }

}
