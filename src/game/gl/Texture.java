package game.gl;

import static org.lwjgl.opengl.GL11.GL_TEXTURE_2D;
import static org.lwjgl.opengl.GL11.glBindTexture;
import static org.lwjgl.opengl.GL11.glDeleteTextures;

/**
 * Class representing a texture that is recognised by OpenGL.
 */
public class Texture {

    private int textureId;

    /**
     * Size of the raw image that was used to create this Texture.
     */
    private int imgWidth, imgHeight;

    /**
     * Size of the Texture, as far as OpenGL is concerned.
     *
     * <p>This is equivalent to the image size rounded up to the nearest power
     * of 2.
     */
    private int texWidth, texHeight;

    public Texture(int textureId, int imgWidth, int imgHeight,
            int texWidth, int texHeight) {
        this.textureId = textureId;
        this.imgWidth = imgWidth;
        this.imgHeight = imgHeight;
        this.texWidth = texWidth;
        this.texHeight = texHeight;
    }

    public void bind() {
        glBindTexture(GL_TEXTURE_2D, textureId);
    }

    public int getImageWidth() {
        return imgWidth;
    }

    public int getImageHeight() {
        return imgHeight;
    }

    public int getTextureWidth() {
        return texWidth;
    }

    public int getTextureHeight() {
        return texHeight;
    }

    public int getTextureId() {
        return textureId;
    }

    public void destroy() {
        glDeleteTextures(textureId);
    }

}
