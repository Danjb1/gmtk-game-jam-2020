import { Entity } from '../entity';
import { Viewport } from 'pixi-viewport';

// Components
import {
  CatMetaComponent,
  HitboxComponent,
  WanderComponent,
  AnimatedSpriteComponent,
  ScaredComponent
} from '../components';

/**
 * Generates a cat entity
 */
export const createCat = (x: number, y: number, viewport: Viewport): Entity => {
  // Generate the meta before anything else;
  const catMeta = new CatMetaComponent();
  const animatedSprite = new AnimatedSpriteComponent(`ash_down`, viewport);

  const catEntity = new Entity()
    .attach(catMeta)
    .attach(new HitboxComponent(x, y, 30, 30))
    .attach(animatedSprite)
    .attach(new WanderComponent())
    .attach(new ScaredComponent());

  return catEntity;
};
