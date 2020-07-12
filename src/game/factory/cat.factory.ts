import { Entity } from '../entity';

// Components
import {
  CatMetaComponent,
  HitboxComponent,
  WanderComponent,
  AnimatedSpriteComponent,
  ScaredComponent,
  JailableComponent,
  RescueComponent,
  MeowComponent,
  LateComponent
} from '../components';

/**
 * Generates a cat entity
 */
export class CatFactory {
  private catBehavior: any;

  constructor(catBehavior: any) {
    this.catBehavior = catBehavior;
  }

  public create(x: number, y: number): Entity {
    // Generate the meta before anything else;
    const catMeta = new CatMetaComponent();
    const animatedSprite = new AnimatedSpriteComponent(`cats/${catMeta.variety}`);

    const catEntity = new Entity()
      .attach(catMeta)
      .attach(new HitboxComponent(x, y, 30, 30))
      .attach(animatedSprite)
      .attach(new WanderComponent(this.catBehavior.wandering.minSpeed,
                                  this.catBehavior.wandering.maxSpeed))
      .attach(new JailableComponent())
      .attach(new ScaredComponent(this.catBehavior.scared.flightDistance,
                                  this.catBehavior.scared.flightSpeed))
      .attach(new RescueComponent())
      .attach(new MeowComponent(this.catBehavior.meowing.interval,
                                this.catBehavior.meowing.chance))
      .attach(new LateComponent());

    return catEntity;
  };
}
