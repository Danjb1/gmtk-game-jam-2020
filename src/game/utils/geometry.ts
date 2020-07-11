import { HitboxComponent } from '../components/hitbox.component';

/**
 * Gives the absolute straight-line distance between two HitboxComponents.
 */
export const getDistanceBetween = (a: HitboxComponent, b: HitboxComponent): number => {
  return Math.sqrt(Math.pow((b.x - a.x), 2) + Math.pow((b.y - b.x), 2));
};
