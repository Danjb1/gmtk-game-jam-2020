import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';
import { intBetween, getHitboxFrom } from '../utils';
import { Entity } from '../entity';

export interface SpawnOptions {
  createFn: any;
  interval: number;
  chanceToSpawn: number;
  attemptsPerInterval: number;
  maxChildren: number;
}

export class SpawnerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  private children: Entity[] = [];

  private timeUntilSpawn: number;

  constructor(private cfg: SpawnOptions) {
    super(SpawnerComponent.KEY);
  }

  public onAttach(e: Entity): void {
    super.onAttach(e);

    this.resetSpawnTimer();
  }

  public destroy(): void {
    // Clear children to prevent any dangling references
    this.children = [];
  }

  public onSpawn(): void {
    this.hitbox = getHitboxFrom(this.entity);
  }

  public update(delta: number): void {

    this.removeDeletedChildren();

    if (this.isSpawnReady(delta)) {
      this.attemptSpawn();
      this.resetSpawnTimer();
    }
  }

  private removeDeletedChildren(): void {
    // Forget about any children that have been deleted
    this.children = this.children.filter(c => !c.deleted);
  }

  private isSpawnReady(delta: number): boolean {
    this.timeUntilSpawn -= delta;
    return this.timeUntilSpawn <= 0;
  }

  private attemptSpawn(): void {
    for (let i = 0; i < this.cfg.attemptsPerInterval; i++) {

      if (!this.isSpawnAllowed()) {
        continue;
      }

      if (this.shouldSpawn()) {
        this.spawnChild();
      }
    }
  }

  private isSpawnAllowed(): boolean {
    return this.children.length < this.cfg.maxChildren;
  }

  private shouldSpawn(): boolean {
    return Math.random() < this.cfg.chanceToSpawn;
  }

  private spawnChild(): void {
    // Pick a random position within the spawner entity's Hitbox
    const x = intBetween(this.hitbox.x, this.hitbox.right);
    const y = intBetween(this.hitbox.y, this.hitbox.bottom);

    // Create our Entity
    const spawned = this.cfg.createFn(x, y);
    this.children.push(spawned);
    this.entity.context.addEntity(spawned);
  }

  private resetSpawnTimer(): void {
    this.timeUntilSpawn = this.cfg.interval;
  }

}
