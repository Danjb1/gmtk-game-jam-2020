import { Entity } from '../entity';

// Components
import {
  CatMetaComponent,
  HitboxComponent,
  WanderComponent,
  AnimatedSpriteComponent,
  ScaredComponent,
  JailableComponent,
  MeowComponent,
  LateComponent
} from '../components';

/**
 * Generates a cat entity
 */
export class CatFactory {
  private cfg: any;

  constructor(config: any) {
    this.cfg = config;
  }

  public create(x: number, y: number): Entity {
    // Generate the meta before anything else;
    const catMeta = new CatMetaComponent();
    const animatedSprite = new AnimatedSpriteComponent(`cats/${catMeta.variety}`);

    const catEntity = new Entity()
      .attach(catMeta)
      .attach(new HitboxComponent(x, y, 30, 30))
      .attach(animatedSprite)
      .attach(new WanderComponent(this.cfg.wanderComp.minSpeed, this.cfg.wanderComp.maxSpeed))
      .attach(new JailableComponent())
      .attach(new ScaredComponent())
      .attach(new MeowComponent(this.cfg.meowComp.interval, this.cfg.meowComp.chance))
      .attach(new LateComponent());

    return catEntity;
  };
}
