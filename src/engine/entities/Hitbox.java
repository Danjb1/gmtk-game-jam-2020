package engine.entities;

public class Hitbox {

    public enum Edge {
        TOP,
        LEFT,
        BOTTOM,
        RIGHT
    }

    // Position and size
    public float x;
    public float y;
    public float width;
    public float height;

    // Previous position
    public float prevX;
    public float prevY;

    // Current speed, in world units per second
    public float speedX;
    public float speedY;

    /**
     * Constructs a Hitbox with the given position and size.
     *
     * @param x
     * @param y
     * @param width
     * @param height
     */
    public Hitbox(float x, float y, float width, float height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        prevX = x;
        prevY = y;
    }

    /**
     * Gets the x-position of the right edge of this Hitbox, in world units.
     *
     * @return
     */
    public float getRight() {
        return x + width;
    }

    /**
     * Gets the y-position of the bottom edge of this Hitbox, in world units.
     *
     * @return
     */
    public float getBottom() {
        return y + height;
    }

    /**
     * Gets the x-position of the centre of this Hitbox, in world units.
     *
     * @return
     */
    public float getCentreX() {
        return x + width / 2;
    }

    /**
     * Gets the y-position of the centre of this Hitbox, in world units.
     *
     * @return
     */
    public float getCentreY() {
        return y + height / 2;
    }

    /**
     * Determines if this Hitbox intersects another.
     *
     * @param other The Hitbox to check for intersection.
     * @return True if the Hitboxes intersect, false otherwise.
     */
    public boolean intersects(Hitbox other) {
        /*
         * See:
         * https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
         *
         * This first determines if there is any x-overlap, and then if there is
         * is any y-overlap.
         */
        return x < other.getRight() && getRight() > other.x &&
                y < other.getBottom() && getBottom() > other.y;
    }

}
