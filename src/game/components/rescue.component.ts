import { Component } from '../component';
import { CatMetaComponent } from './cat-meta.component';

/**
 * Handles a cat being picked up
 */
export class RescueComponent extends Component {
  static readonly KEY = Symbol();

  private _catMeta: CatMetaComponent;

  constructor(){
    super(RescueComponent.KEY);
    this._catMeta = this.entity.getComponent(CatMetaComponent.KEY) as CatMetaComponent;
  }

  private _isInJail(): boolean {
    return false; // TODO implement is it in jail?
  }

  update() {
    if (!this._catMeta.canBePickedUp || !this._isInJail) {
      return
    }
    // Add the cats score to the game state
    this.entity.context.getState().score += this._catMeta.value;
    // Delete the cat
    this.entity.deleted = true;
  }

}