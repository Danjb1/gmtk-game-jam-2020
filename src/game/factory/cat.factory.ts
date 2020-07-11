import { Entity } from '../entity';

// Components
import { CatMetaComponent, HitboxComponent, WanderComponent } from '../components';

export const createCat = (x: number, y: number): Entity => {
  return new Entity()
    .attach(new HitboxComponent(x, y, 10, 10))
    .attach(new CatMetaComponent())
    .attach(new WanderComponent());
};
