import { Component } from '../component';
import { getHitboxFrom } from '../utils';
import { HitboxComponent, HitboxListener } from './hitbox.component';
import { Entity } from '../entity';
import { JailableComponent } from './jailable.component';

export class JailerComponent extends Component implements HitboxListener {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  constructor() {
    super(JailerComponent.KEY);
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
    this.hitbox.addListener(this);
  }

  public onDestroy(): void {
    this.hitbox.removeListener(this);
  }

  public hitboxCollided(other: Entity): void {
    const jailable = <JailableComponent>
        other.getComponent(JailableComponent.KEY);

    if (jailable) {
      this.jailEntity(other);
    }
  }

  private jailEntity(e: Entity): void {
    // TMP
    e.deleted = true;
  }

}
