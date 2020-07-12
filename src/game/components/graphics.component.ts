import * as PIXI from 'pixi.js';

import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';

// Utils
import { getHitboxFrom } from '../utils';


export class GraphicsComponent extends Component {

  public static readonly KEY = Symbol();

  private graphics: PIXI.Graphics;
  private hitbox: HitboxComponent;

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    graphicsAttributes: any,
    graphicsSettings?: any,
  ) {
    super(GraphicsComponent.KEY);

    this.graphics = new PIXI.Graphics();
    this.graphics.beginFill(graphicsAttributes.fillColor || 0x000000);
    this.graphics.lineStyle(graphicsAttributes.lineThickness || 0, graphicsAttributes.lineColor || 0x000000);

    switch (graphicsAttributes.shape) {
      case 'rectangle':
        this.graphics.drawRect(x, y, width, height);
        break;
      default:
        this.graphics.drawRect(x, y, width, height);
        break;
    }
    if (graphicsSettings) {
      this.graphics = Object.assign(this.graphics, graphicsSettings);
    }

  }


  public onSpawn(): void {

    // Register this Graphics with Pixi
    const viewport = this.entity.context.getViewport();
    viewport.addChild(this.graphics);
    viewport.sortChildren();

    // Retrieve the Hitbox from the Entity
    this.hitbox = getHitboxFrom(this.entity);

    this.snapToEntity();
  }


  public destroy(): void {
    this.entity.context.getViewport().removeChild(this.graphics);
  }

  public lateUpdate(delta: number): void {
    this.snapToEntity();
  }

  private snapToEntity(): void {
    // Update the position of the Sprite based on the Entity position
    this.graphics.x = this.hitbox.x;
    this.graphics.y = this.hitbox.y;
    this.graphics.width = this.hitbox.width;
    this.graphics.height = this.hitbox.height;
  }

}
