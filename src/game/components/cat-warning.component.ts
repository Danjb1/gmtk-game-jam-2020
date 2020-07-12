import * as PIXI from 'pixi.js';
import { Component } from "../component";
import { CatMetaComponent } from "./cat-meta.component";
import { HitboxComponent } from ".";
import { getHitboxFrom } from "../utils";
import { Entity } from '../entity';
import { JailedComponent } from './jailed.component';

export class CatWarningComponent extends Component {
  static readonly KEY = Symbol();

  private _catMeta: CatMetaComponent;

  private text: PIXI.Text;
  private hitbox: HitboxComponent;

  private static textStyles: Partial<PIXI.TextStyle> = { 
    fontFamily: 'Do Hyeon', 
    fontSize: 18, 
    fill: 0xc62602, 
    align: 'center', 
    fontWeight: 'bold'
  }

  constructor() {
    super(CatWarningComponent.KEY);

    this.text = new PIXI.Text(`!`, CatWarningComponent.textStyles)
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
    this.text.visible = (!this.entity.getComponent(JailedComponent.KEY)) && this._catMeta.warnPlayer;
    this.text.style.fill = this._catMeta.canBePickedUp ? 0xc62602 : 0xd46a09;
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