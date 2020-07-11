import { Component } from '../component';
import { getHitboxFrom } from '../utils';
import { HitboxComponent } from './hitbox.component';
import { Entity } from '../entity';
import { JailableComponent } from './jailable.component';

export class JailerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  constructor() {
    super(JailerComponent.KEY);
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
    // TODO: add listener to hitbox
  }

  private onCollision(e: Entity): void {
    const jailable = <JailableComponent> e.getComponent(JailableComponent.KEY);
    if (jailable) {
      // TODO: put entity in jail!
    }
  }

}
