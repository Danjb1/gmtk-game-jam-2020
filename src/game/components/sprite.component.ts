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
  }

  update(delta: number): void {
    // TODO: Update position of Pixi graphic based on Entity position
  }

}