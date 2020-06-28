package game;

/**
 * Camera that can "see" a portion of the game world.
 */
public class Camera {

    /**
     * Distance of the Camera from the game.
     */
    public static final float Z_DISTANCE = 1;

    /**
     * Rectangle of the world that is visible to this camera, in world units.
     */
    public Rectangle visibleRect = new Rectangle();

    public Camera(float width, float height) {
        visibleRect = new Rectangle(0, 0, width, height);
    }

    public void centreOn(float x, float y) {
        visibleRect.x = x - visibleRect.width / 2;
        visibleRect.y = y - visibleRect.height / 2;
    }

}
