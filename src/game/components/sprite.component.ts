import { Component } from '../component';
import { Entity } from '../entity';

export class SpriteComponent extends Component {

  constructor(private filename: string) {
    super();
  }

  onAttach(e: Entity) {
    super.onAttach(e);

    // TODO: Create Pixi graphic
  }

  update(delta: number): void {
    // TODO: Update position of Pixi graphic
  }

}