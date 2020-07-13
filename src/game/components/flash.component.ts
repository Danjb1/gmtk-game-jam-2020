import { Component } from '../component';
import { Game } from '../game';
import * as PIXI from 'pixi.js';

export class FlashComponent extends Component {

  public static readonly KEY = Symbol();

  private catCollectedPixiText: PIXI.Text;

  constructor() {
    super(FlashComponent.KEY);
    this.catCollectedPixiText = new PIXI.Text(`Cat Collected`, { fontFamily: 'Do Hyeon', fontSize: 15, fill: 0xffffff, opacity: .5, align: 'center' });
    this.catCollectedPixiText.position.set((Game.CANVAS_WIDTH - this.catCollectedPixiText.width) * 0.39, (Game.CANVAS_HEIGHT - this.catCollectedPixiText.height) * 0.72);
  }

  public destroy(): void {
    const viewport = this.entity.context.getViewport();
    viewport.addChild(this.catCollectedPixiText);
    setTimeout(() => {
      viewport.removeChild(this.catCollectedPixiText);
    }, 500);
  }
}
