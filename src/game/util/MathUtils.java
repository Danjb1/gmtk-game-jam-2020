package game.util;

public class MathUtils {

    /**
     * Clamps a value between 2 limits.
     *
     * @param val
     * @param min
     * @param max
     * @return
     */
    public static float clampf(float val, float min, float max) {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        } else {
            return val;
        }
    }

    /**
     * Given 2 trajectories, gets the corresponding angle in degrees.
     *
     * @param dx
     * @param dy
     * @return
     */
    public static float getAngle(float dx, float dy) {

        // Edge cases when moving in only one axis
        if (dx == 0) {
            // Moving up / down
            return dy < 0 ? 0 : 180;
        }
        if (dy == 0) {
            // Moving left / right
            return dx < 0 ? 270 : 90;
        }

        double angle = Math.toDegrees(Math.atan(Math.abs(dx) / Math.abs(dy)));

        // Adjust angle according to quadrant
        if (dx > 0 && dy < 0) {
            // no change
        } else if (dx > 0 && dy > 0) {
            angle = 180 - angle;
        } else if (dx < 0 && dy > 0) {
            angle = 180 + angle;
        } else {
            angle = 360 - angle;
        }

        return (float) angle;
    }

    /**
     * Gets the x-component of the given angle.
     *
     * @param angle Angle in degrees, where 0 = up, 90 = right, etc.
     * @return 0-1 (0 when angle is vertical, 1 when angle is horizontal).
     */
    public static float getAngleXComponent(double angle) {
        double angleRad = Math.toRadians(angle);
        return (float) Math.sin(angleRad);
    }

    /**
     * Gets the y-component of the given angle.
     *
     * @param angle Angle in degrees, where 0 = up, 90 = right, etc.
     * @return 0-1 (0 when angle is horizontal, 1 when angle is vertical).
     */
    public static float getAngleYComponent(double angle) {
        double angleRad = Math.toRadians(angle);
        return (float) -Math.cos(angleRad);
    }
}
