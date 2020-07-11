import { Component } from '../component';
import { getHitboxFrom } from '../utils';
import { HitboxComponent, HitboxListener } from './hitbox.component';
import { Entity } from '../entity';
import { JailableComponent } from './jailable.component';
import { JailedComponent } from './jailed.component';

export class JailerComponent extends Component implements HitboxListener {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private prisoners: Entity[] = [];

  constructor() {
    super(JailerComponent.KEY);
  }

  public destroy(): void {
    // Clear prisoners to prevent any dangling references
    this.prisoners = [];
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
    this.hitbox.addListener(this);
  }

  public onDestroy(): void {
    this.hitbox.removeListener(this);
  }

  public update(): void {
    this.removeDeletedPrisoners();
  }

  private removeDeletedPrisoners(): void {
    // Forget about any prisoners that have been deleted
    this.prisoners = this.prisoners.filter(e => !e.deleted);
  }

  public hitboxCollided(other: HitboxComponent): void {
    const jailable = <JailableComponent>
        other.entity.getComponent(JailableComponent.KEY);

    if (jailable && !this.prisoners.includes(other.entity)) {
      this.jailEntity(other.entity);
    }
  }

  private jailEntity(e: Entity): void {
    this.prisoners.push(e);
    e.attach(new JailedComponent(this));
  }

}
