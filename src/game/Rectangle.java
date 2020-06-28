package game;

/**
 * Replacement for java.awt.geom.Rectangle2D.
 *
 * <p>AWT is incompatible with LWJGL on MacOS:
 * https://github.com/LWJGL/lwjgl3/issues/68#issuecomment-113737602
 */
public class Rectangle {

    public float x;
    public float y;
    public float width;
    public float height;

    public Rectangle() {}

    public Rectangle(int x, int y, int width, int height) {
        setRect(x, y, width, height);
    }

    public Rectangle(float x, float y, float width, float height) {
        setRect(x, y, width, height);
    }

    public void setRect(float x, float y, float width, float height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    public float getCenterX() {
        return x + width / 2;
    }

    public float getCenterY() {
        return y + height / 2;
    }

    public float getMaxX() {
        return x + width;
    }

    public float getMaxY() {
        return y + height;
    }

    public boolean contains(float px, float py) {
        return px >= x
                && py >= y
                && px < x + width
                && py < y + height;
    }

    public void translate(int dx, int dy) {
        x += dx;
        y += dy;
    }

}
