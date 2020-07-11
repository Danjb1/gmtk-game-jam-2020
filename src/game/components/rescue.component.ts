import { Component } from '../component';
import { CatMetaComponent } from './cat-meta.component';
import { JailedComponent } from '.';
import { Entity } from '../entity';

/**
 * Handles a cat being picked up
 */
export class RescueComponent extends Component {
  static readonly KEY = Symbol();

  private _catMeta: CatMetaComponent;

  constructor() {
    super(RescueComponent.KEY);
  }

  onAttach(e: Entity): void {
    super.onAttach(e);
    this._catMeta = this.entity.getComponent(CatMetaComponent.KEY) as CatMetaComponent;
  }

  private _isInJail(): boolean {
    return !!this.entity.getComponent(JailedComponent.KEY);
  }

  update() {
    if (!this._catMeta.canBePickedUp || !this._isInJail()) {
      return;
    }
    // Add the cats score to the game state
    this.entity.context
      .getState()
      .increaseScore(this._catMeta.value);

    // Delete the cat
    this.entity.deleted = true;
  }

}