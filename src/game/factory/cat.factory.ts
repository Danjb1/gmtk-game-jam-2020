import { Entity } from '../entity';
import { HitboxComponent, WanderComponent, SpriteComponent } from '../components';
import { CatMetaComponent, CatBreed } from '../components/cat-meta.component';
import { Viewport } from 'pixi-viewport';

/**
 * Generates a cat entity
 */
export const createCat = (viewport: Viewport): Entity => {
  // Generate the meta before anything else;
  const catMeta = new CatMetaComponent();
  const sprite = new SpriteComponent(`cat-${catMeta.breed}.png`, viewport);

  const catEntity = new Entity()
    .attach(catMeta)
    .attach(new HitboxComponent(0, 0, 30, 30))
    .attach(sprite);

  return catEntity;
};
