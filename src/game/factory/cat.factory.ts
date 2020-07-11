import { Entity } from '../entity';

// Components
import {
  CatMetaComponent,
  HitboxComponent,
  WanderComponent,
  AnimatedSpriteComponent
} from '../components';

/**
 * Generates a cat entity
 */
export const createCat = (x: number, y: number): Entity => {
  // Generate the meta before anything else;
  const catMeta = new CatMetaComponent();
  const animatedSprite = new AnimatedSpriteComponent(`ash_down`);

  const catEntity = new Entity()
    .attach(catMeta)
    .attach(new HitboxComponent(x, y, 30, 30))
    .attach(animatedSprite)
    .attach(new WanderComponent());

  return catEntity;
};
