import { Component } from "../component";
import { CatMetaComponent } from ".";
import { Entity } from "../entity";

export class LateComponent extends Component {
  static readonly KEY = Symbol();

  private _catMeta: CatMetaComponent;

  constructor() {
    super(LateComponent.KEY);
  }

  onAttach(e: Entity): void {
    super.onAttach(e);
    this._catMeta = this.entity.getComponent(CatMetaComponent.KEY) as CatMetaComponent;
  }

  update() {
    if (!this._catMeta.late) {
      return;
    }

    // Remove this component (only remove one life per cat)
    this.deleted = true;
    
    this.entity.context
      .getState()
      .loseLife();
  }
}