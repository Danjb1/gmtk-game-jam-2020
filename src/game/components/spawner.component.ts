import { Viewport } from 'pixi-viewport';

import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';
import { intBetween } from '../utils';

export class SpawnerComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  /**
   * Chance to start wandering each frame.
   *
   * 0.0166666 is once per second, on average.
   */
  private spawnChance = 0.01;

  constructor(private createFn: any, private viewport: Viewport) {
    super(SpawnerComponent.KEY);
  }

  public onSpawn(): void {
    this.hitbox = <HitboxComponent>
        this.entity.getComponent(HitboxComponent.KEY);
  }

  public update(delta: number): void {
    if (this.shouldSpawn()) {
      this.spawnEntity();
    }
  }

  private shouldSpawn(): boolean {
    return Math.random() < this.spawnChance;
  }

  private spawnEntity(): void {

    // Pick a random position within the spawner entity's Hitbox
    const x = intBetween(this.hitbox.x, this.hitbox.right);
    const y = intBetween(this.hitbox.y, this.hitbox.bottom);

    // Create our Entity
    const spawned = this.createFn(x, y, this.viewport);
    this.entity.context.addEntity(spawned);
  }

}
