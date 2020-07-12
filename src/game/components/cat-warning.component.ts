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

  private static COLOURS = {
    WARN: 0xFF9800,
    PICKUP: 0xF44336
  }

  private static textStyles: Partial<PIXI.TextStyle> = {
    fontFamily: 'Do Hyeon',
    fontSize: 20,
    fill: 0xc62602,
    align: 'center',
    stroke: 'black',
    strokeThickness: 1
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
    this.text.style.fill = this._catMeta.canBePickedUp ? CatWarningComponent.COLOURS.PICKUP : CatWarningComponent.COLOURS.WARN;
    this.snapToEntity();
  }

  public lateUpdate(delta: number): void {
    this.snapToEntity();
  }

  private snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.text.x = this.hitbox.x + 10;
    this.text.y = this.hitbox.y - 6;
  }

  destroy() {
    this.text.destroy();
  }


}