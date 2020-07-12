import * as PIXI from 'pixi.js';
import { Component } from "../component";
import { CatMetaComponent } from "./cat-meta.component";
import { HitboxComponent } from ".";
import { getHitboxFrom } from "../utils";
import { Entity } from '../entity';
import { JailedComponent } from './jailed.component';

export class CatWarning extends Component {
  static readonly KEY = Symbol();

  private _catMeta: CatMetaComponent;

  private text: PIXI.Text;
  private hitbox: HitboxComponent;


  constructor() {
    super(CatWarning.KEY);

    this.text = new PIXI.Text(`!`, { fontFamily: 'Do Hyeon', fontSize: 18, fill: 0xc62602, align: 'center', 'font-weight': 'bold' })
    this.text.visible = false;
  }

  onAttach(entity: Entity) {
    super.onAttach(entity);
  }

  onSpawn() {
    this._catMeta = <CatMetaComponent>this.entity.getComponent(CatMetaComponent.KEY);

    const viewport = this.entity.context.getViewport();
    viewport.addChild(this.text);
    viewport.sortChildren();

    this.hitbox = getHitboxFrom(this.entity);

    this.snapToEntity();
  }

  update() {
    this.text.visible = (!this.entity.getComponent(JailedComponent.KEY)) && this._catMeta.canBePickedUp;
    this.snapToEntity();
  }

  public lateUpdate(delta: number): void {
    this.snapToEntity();
  }

  private snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.text.x = this.hitbox.x + 8;
    this.text.y = this.hitbox.y - 3;
  }

  destroy() {
    this.text.destroy();
  }


}