import { HitboxComponent } from '../components/hitbox.component';

/**
 * Gives the straight-line distance between the centres of two HitboxComponents.
 */
export const getDistanceBetween = (a: HitboxComponent, b: HitboxComponent): number => {
  return a.centrePosition.hypotenuse(b.centrePosition);
};
