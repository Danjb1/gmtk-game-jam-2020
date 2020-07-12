import { Entity } from '../entity';
import { HitboxComponent } from '../components/hitbox.component';
import { getRangeBetween } from './geometry';

/**
 * Extracts the HitboxComponent from an Entity, if it has one.
 */
export const getHitboxFrom = (entity: Entity): HitboxComponent => {
  return entity.getComponent<HitboxComponent>(HitboxComponent.KEY);
};

/**
 * Gets the straight-line distance from one Entity to another.
 */
export const getRangeBetweenEntities = (
  thisEntity: Entity, otherEntity: Entity
): number => {
  return getRangeBetween(getHitboxFrom(thisEntity), getHitboxFrom(otherEntity));
};
