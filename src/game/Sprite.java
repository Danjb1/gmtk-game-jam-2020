package game;

import game.gl.Texture;

public class Sprite {

    // The Texture containing this Sprite
    public Texture texture;

    // Position and size at which the Sprite should be rendered, in world units
    public float x;
    public float y;
    public float z; // TODO: Enable depth buffer and pass z to GPU
    public float width;
    public float height;

    // Rectangle of the Texture to sample, in pixels
    public int srcX;
    public int srcY;
    public int srcWidth;
    public int srcHeight;

    // Whether the Sprite should be flipped
    public boolean flipX;
    public boolean flipY;

    /**
     * Creates a Sprite that will be rendered at a pixel perfect scale.
     *
     * @param texture
     * @param srcX
     * @param srcY
     * @param srcWidth
     * @param srcHeight
     * @return
     */
    public static Sprite pixelScale(
            Texture texture,
            int srcX,
            int srcY,
            int srcWidth,
            int srcHeight) {
        return new Sprite(
                texture,
                srcWidth,
                srcHeight,
                srcX,
                srcY,
                srcWidth,
                srcHeight);
    }

    private Sprite(
            Texture texture,
            float width,
            float height,
            int srcX,
            int srcY,
            int srcWidth,
            int srcHeight) {
        this.texture = texture;
        this.width = width;
        this.height = height;
        this.srcX = srcX;
        this.srcY = srcY;
        this.srcWidth = srcWidth;
        this.srcHeight = srcHeight;
    }

    /**
     * Gets the left texture co-ordinate in the range 0-1.
     *
     * @return
     */
    public float getTexCoord_X1() {
        return srcX / (float) texture.getTextureWidth();
    }

    /**
     * Gets the right texture co-ordinate in the range 0-1.
     *
     * @return
     */
    public float getTexCoord_X2() {
        return (srcX + srcWidth) / (float) texture.getTextureWidth();
    }

    /**
     * Gets the top texture co-ordinate in the range 0-1.
     *
     * <p>We subtract from 1 to account for the OpenGL origin.
     *
     * @return
     */
    public float getTexCoord_Y1() {
        return 1 - (srcY / (float) texture.getTextureHeight());
    }

    /**
     * Gets the bottom texture co-ordinate in the range 0-1.
     *
     * <p>We subtract from 1 to account for the OpenGL origin.
     *
     * @return
     */
    public float getTexCoord_Y2() {
        return 1 - ((srcY + srcHeight) / (float) texture.getTextureHeight());
    }

}
