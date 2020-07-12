import { Entity } from '../entity';
import { getRangeBetween } from './geometry';
import { HitboxComponent } from '../components/hitbox.component';
import { JailedComponent } from '../components/jailed.component';
import { JourneyComponent } from '../components/journey.component';

/**
 * Extracts the HitboxComponent from an Entity, if it has one.
 */
export const getHitboxFrom = (entity: Entity): HitboxComponent => {
  return entity.getComponent<HitboxComponent>(HitboxComponent.KEY);
};

/**
 * Checks whether an Entity is in jail.
 */
export const isJailed = (entity: Entity): boolean => {
  return entity.getComponent<JailedComponent>(JailedComponent.KEY) !== undefined;
};

/**
 * Checks whether an Entity has a destination.
 */
export const hasDestination = (entity: Entity): boolean => {
  return entity.getComponent<JourneyComponent>(JourneyComponent.KEY) !== undefined;
};

/**
 * Gets the straight-line distance from one Entity to another.
 */
export const getRangeBetweenEntities = (
  thisEntity: Entity, otherEntity: Entity
): number => {
  return getRangeBetween(getHitboxFrom(thisEntity), getHitboxFrom(otherEntity));
};
