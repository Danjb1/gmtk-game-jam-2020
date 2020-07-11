import { HitboxComponent, Edge } from '../components/hitbox.component';
import { Vector } from './vector';

/**
 * Gives the straight-line distance between the centres of two HitboxComponents.
 */
export const getDistanceBetween = (a: HitboxComponent, b: HitboxComponent): number => {
  return a.centrePosition.hypotenuse(b.centrePosition);
};

/**
 * Determines if 2 lines intersect.
 *
 * <p>This is a simplification of {@link #getLineIntersection}.
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 * @param x4
 * @param y4
 * @param extendToInfinity Whether to extend the lines beyond the given
 * segments.
 *
 * @return Point, or null if the lines do no intersect.
 */
export const doLinesIntersect = (
    x1: number, y1: number,
    x2: number, y2: number,
    x3: number, y3: number,
    x4: number, y4: number,
    extendToInfinity = false): boolean => {

  // Does either line have length 0?
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return false;
  }

  const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // Are the lines parallel?
  if (denominator === 0) {
    return false;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Is the intersection outside the given segments?
  if (!extendToInfinity && (ua < 0 || ua > 1 || ub < 0 || ub > 1)) {
    return false;
  }

  return true;
};

/**
 * Calculates the point of intersection between 2 lines.
 *
 * <p>Based on Paul Bourke (1989):
 * http://paulbourke.net/geometry/pointlineplane/
 *
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @param x3
 * @param y3
 * @param x4
 * @param y4
 * @param extendToInfinity Whether to extend the lines beyond the given
 * segments.
 *
 * @return Point, or null if the lines do no intersect.
 */
export const getLineIntersection = (
  x1: number, y1: number,
  x2: number, y2: number,
  x3: number, y3: number,
  x4: number, y4: number,
  extendToInfinity = false): Vector => {

  // Does either line have length 0?
  if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
    return null;
  }

  const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

  // Are the lines parallel?
  if (denominator === 0) {
    return null;
  }

  const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
  const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

  // Is the intersection outside the given segments?
  if (!extendToInfinity && (ua < 0 || ua > 1 || ub < 0 || ub > 1)) {
    return null;
  }

  // Calculate the point of intersection
  const x = x1 + ua * (x2 - x1);
  const y = y1 + ua * (y2 - y1);

  return new Vector(x, y);
};

/**
 * Determines which edge of a Hitbox was involved in a collision.
 *
 * @param h1 The Hitbox whose movement caused the collision.
 * @param h2 The Hitbox whose edge was collided with.
 *
 * <p>In reality BOTH Hitboxes may have caused the collision, as they could
 * have moved into each other. But for the sake of this method, assume that
 * one Hitbox collided with the other.
 *
 * @return Edge of h2 with which h1 collided, or null if no edge collision
 * occurred.
 */
export const getCollisionEdge = (h1: HitboxComponent, h2: HitboxComponent): Edge => {

  // Find the corners of h1 before and after movement
  const cornersBefore = [
        new Vector(h1.prevX, h1.prevY),
        new Vector(h1.prevX + h1.width, h1.prevY),
        new Vector(h1.prevX + h1.width, h1.prevY + h1.height),
        new Vector(h1.prevX, h1.prevY + h1.height)
  ];
  const cornersAfter = [
        new Vector(h1.x, h1.y),
        new Vector(h1.x + h1.width, h1.y),
        new Vector(h1.x + h1.width, h1.y + h1.height),
        new Vector(h1.x, h1.y + h1.height)
  ];

  // Check if any corner of h1 intersected with any edge of h2
  for (let i = 0; i < cornersBefore.length; i++) {

    if (doLinesIntersect(
            cornersBefore[i].x, cornersBefore[i].y,
            cornersAfter[i].x, cornersAfter[i].y,
            h2.x, h2.y,
            h2.x + h2.width, h2.y)) {
        return Edge.TOP;
    }

    if (doLinesIntersect(
            cornersBefore[i].x, cornersBefore[i].y,
            cornersAfter[i].x, cornersAfter[i].y,
            h2.x, h2.y,
            h2.x, h2.y + h2.height)) {
        return Edge.LEFT;
    }

    if (doLinesIntersect(
            cornersBefore[i].x, cornersBefore[i].y,
            cornersAfter[i].x, cornersAfter[i].y,
            h2.x, h2.y + h2.height,
            h2.x + h2.width, h2.y + h2.height)) {
        return Edge.BOTTOM;
    }

    if (doLinesIntersect(
            cornersBefore[i].x, cornersBefore[i].y,
            cornersAfter[i].x, cornersAfter[i].y,
            h2.x + h2.width, h2.y,
            h2.x + h2.width, h2.y + h2.height)) {
        return Edge.RIGHT;
    }
  }

  return null;
};
