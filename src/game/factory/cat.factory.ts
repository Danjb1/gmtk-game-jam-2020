import { Entity } from '../entity';
import { EntityContext } from '../entity-context';

// Components
import { CatMetaComponent, HitboxComponent, WanderComponent } from '../components';

export const createCat = (): Entity => {
  return new Entity()
    .attach(new HitboxComponent(0, 0, 10, 10))
    .attach(new CatMetaComponent())
    .attach(new WanderComponent());
};
