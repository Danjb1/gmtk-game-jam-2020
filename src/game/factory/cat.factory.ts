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
  LateComponent,
  CatWarningComponent,
  RescueComponent
} from '../components';
import { FlashComponent } from '../components/flash.component';

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

    const animatedSprite = new AnimatedSpriteComponent(
      `cats/${catMeta.variety}/${catMeta.variety}`
    );

    const catEntity = new Entity()
      .attach(catMeta)
      .attach(new HitboxComponent(x, y, 30, 30))
      .attach(animatedSprite)
      .attach(new WanderComponent(this.catBehavior.wandering))
      .attach(new JailableComponent())
      .attach(new ScaredComponent(
        this.catBehavior.scared.flightDistance,
        this.catBehavior.scared.flightSpeed))
      .attach(new MeowComponent())
      .attach(new LateComponent())
      .attach(new RescueComponent())
      .attach(new CatWarningComponent())
      .attach(new MeowComponent())
      .attach(new LateComponent())
      .attach(new FlashComponent());

    return catEntity;
  }
}
