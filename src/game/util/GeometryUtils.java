package game.util;

import java.awt.Point;
import java.awt.geom.Point2D;

import engine.entities.Hitbox;
import engine.entities.Hitbox.Edge;

public class GeometryUtils {

    public static boolean doLinesIntersect(
            float x1, float y1,
            float x2, float y2,
            float x3, float y3,
            float x4, float y4) {
        return doLinesIntersect(x1, y1, x2, y2, x3, y3, x4, y4, false);
    }

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
    public static boolean doLinesIntersect(
            float x1, float y1,
            float x2, float y2,
            float x3, float y3,
            float x4, float y4,
            boolean extendToInfinity) {

        // Does either line have length 0?
        if ((x1 == x2 && y1 == y2) || (x3 == x4 && y3 == y4)) {
            return false;
        }

        float denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // Are the lines parallel?
        if (denominator == 0) {
            return false;
        }

        float ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        float ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // Is the intersection outside the given segments?
        if (!extendToInfinity && (ua < 0 || ua > 1 || ub < 0 || ub > 1)) {
            return false;
        }

        return true;
    }

    public static Point2D.Float getLineIntersection(
            float x1, float y1,
            float x2, float y2,
            float x3, float y3,
            float x4, float y4) {
        return getLineIntersection(x1, y1, x2, y2, x3, y3, x4, y4, false);
    }

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
    public static Point2D.Float getLineIntersection(
            float x1, float y1,
            float x2, float y2,
            float x3, float y3,
            float x4, float y4,
            boolean extendToInfinity) {

        // Does either line have length 0?
        if ((x1 == x2 && y1 == y2) || (x3 == x4 && y3 == y4)) {
            return null;
        }

        float denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

        // Are the lines parallel?
        if (denominator == 0) {
            return null;
        }

        float ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
        float ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

        // Is the intersection outside the given segments?
        if (!extendToInfinity && (ua < 0 || ua > 1 || ub < 0 || ub > 1)) {
            return null;
        }

        // Calculate the point of intersection
        float x = x1 + ua * (x2 - x1);
        float y = y1 + ua * (y2 - y1);

        return new Point2D.Float(x, y);
    }

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
    public static Edge getCollisionEdge(Hitbox h1, Hitbox h2) {

        // Find the corners of h1 before and after movement
        Point2D.Float[] cornersBefore = new Point2D.Float[] {
                new Point.Float(h1.prevX, h1.prevY),
                new Point.Float(h1.prevX + h1.width, h1.prevY),
                new Point.Float(h1.prevX + h1.width, h1.prevY + h1.height),
                new Point.Float(h1.prevX, h1.prevY + h1.height)
        };
        Point2D.Float[] cornersAfter = new Point2D.Float[] {
                new Point.Float(h1.x, h1.y),
                new Point.Float(h1.x + h1.width, h1.y),
                new Point.Float(h1.x + h1.width, h1.y + h1.height),
                new Point.Float(h1.x, h1.y + h1.height)
        };

        // Check if any corner of h1 intersected with any edge of h2
        for (int i = 0; i < cornersBefore.length; i++) {

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
    }

}
