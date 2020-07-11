import { Component } from '../component';
import { HitboxComponent } from './hitbox.component';
import { RandomUtils } from '../random.utils';

export class WanderComponent extends Component {

  public static readonly KEY = Symbol();

  private hitbox: HitboxComponent;

  private chanceToWander = 0.1;
  private maxWanderSpeed = 1;

  constructor() {
    super(WanderComponent.KEY);
  }

  public onSpawn(): void {
    this.hitbox = <HitboxComponent>
        this.entity.getComponent(HitboxComponent.KEY);
  }

  public update(delta: number): void {
    if (Math.random() < this.chanceToWander) {
      this.hitbox.speedX = RandomUtils.intBetween(
          -this.maxWanderSpeed, this.maxWanderSpeed);
      this.hitbox.speedY = RandomUtils.intBetween(
          -this.maxWanderSpeed, this.maxWanderSpeed);
    }
  }

}
