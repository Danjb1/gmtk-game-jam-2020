import { Entity } from "../entity";
import { HitboxComponent, WanderComponent } from "../components";
import { CatMetaComponent } from "../components/cat-meta.component";

export const createCatFactory = (): Entity => {
  return new Entity()
    .attach(new HitboxComponent(0, 0, 10, 10))
    .attach(new CatMetaComponent())
    .attach(new WanderComponent())
}