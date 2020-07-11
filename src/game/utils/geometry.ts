import { HitboxComponent } from '../components/hitbox.component';

/**
 * Gives the absolute straight-line distance between the centres of two
 * HitboxComponents.
 */
export const getDistanceBetween = (a: HitboxComponent, b: HitboxComponent): number => {
  return Math.sqrt(
    Math.pow((b.centerX - a.centerX), 2) + Math.pow((b.centerY - a.centerY), 2)
  );
};
