import { Component } from '../component';
import { getHitboxFrom } from '../utils';
import { Entity } from '../entity';
import { HitboxComponent, HitboxListener, JailableComponent, JailedComponent, EscapeComponent } from '.';

export class JailerComponent extends Component implements HitboxListener {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;
  private prisoners: Entity[] = [];
  private chanceOfEscape: number;
  private minCaptureTime: number;

  constructor(chanceOfEscape: number, minCaptureTime: number) {
    super(JailerComponent.KEY);
    this.chanceOfEscape = chanceOfEscape;
    this.minCaptureTime = minCaptureTime;
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

  public removeEntityFromPrison(entityToRemove: Entity): void {
    this.prisoners = this.prisoners.filter(entity => entity !== entityToRemove);
  }

  public hitboxCollided(other: HitboxComponent): void {
    const jailable = <JailableComponent>
      other.entity.getComponent(JailableComponent.KEY);

    if (jailable && !this.prisoners.includes(other.entity)) {
      this.jailEntity(other.entity);
    }
  }

  private jailEntity(entity: Entity): void {
    this.prisoners.push(entity);
    entity
      .attach(new JailedComponent(this))
      .attach(new EscapeComponent(this.chanceOfEscape, this.minCaptureTime));
  }

}
