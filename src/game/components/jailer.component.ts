import { Component } from '../component';
import { getHitboxFrom } from '../utils';
import { HitboxComponent, HitboxListener } from './hitbox.component';
import { Entity } from '../entity';
import { JailableComponent } from './jailable.component';
import { JailedComponent } from './jailed.component';

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

  public hitboxCollided(other: HitboxComponent): void {
    const jailable = <JailableComponent>
        other.entity.getComponent(JailableComponent.KEY);

    if (jailable) {
      this.jailEntity(other.entity);
    }
  }

  private jailEntity(e: Entity): void {
    e.attach(new JailedComponent(this));
  }

}
