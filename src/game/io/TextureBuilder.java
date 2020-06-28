package game.io;

import static org.lwjgl.opengl.GL11.GL_NEAREST;
import static org.lwjgl.opengl.GL11.GL_RGBA;
import static org.lwjgl.opengl.GL11.GL_RGBA8;
import static org.lwjgl.opengl.GL11.GL_TEXTURE_2D;
import static org.lwjgl.opengl.GL11.GL_TEXTURE_MAG_FILTER;
import static org.lwjgl.opengl.GL11.GL_TEXTURE_MIN_FILTER;
import static org.lwjgl.opengl.GL11.GL_TEXTURE_WRAP_S;
import static org.lwjgl.opengl.GL11.GL_TEXTURE_WRAP_T;
import static org.lwjgl.opengl.GL11.GL_UNSIGNED_BYTE;
import static org.lwjgl.opengl.GL11.glGenTextures;
import static org.lwjgl.opengl.GL11.glTexImage2D;
import static org.lwjgl.opengl.GL11.glTexParameteri;
import static org.lwjgl.opengl.GL12.GL_CLAMP_TO_EDGE;

import game.gl.Texture;

public class TextureBuilder {

    /**
     * Creates a texture from some image data.
     *
     * @param image
     * @return
     */
    public static Texture createTexture(ImageData image) {

        // Determine image / texture size
        int imgWidth = image.getWidth();
        int imgHeight = image.getHeight();
        int texWidth = ImageUtils.roundToNextPowerOf2(imgWidth);
        int texHeight = ImageUtils.roundToNextPowerOf2(imgHeight);

        // Create a blank image to hold our texture, with power-of-two dimensions
        ImageData newImage = ImageUtils.createBlankImage(texWidth, texHeight);

        // Copy our image onto the new canvas
        ImageUtils.copyPixels(image, newImage,
                0, 0, image.getWidth(), image.getHeight(), 0, 0);

        // Generate a texture ID
        int textureId = glGenTextures();

        // Create the Texture
        Texture texture = new Texture(
                textureId, imgWidth, imgHeight, texWidth, texHeight);

        // Bind the texture
        texture.bind();

        // Set wrap mode
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S,
                GL_CLAMP_TO_EDGE);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T,
                GL_CLAMP_TO_EDGE);

        // Set texture scaling filtering
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_NEAREST);
        glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_NEAREST);

        // Send texel data to OpenGL
        glTexImage2D(GL_TEXTURE_2D, 0, GL_RGBA8,
                texWidth, texHeight,
                0, GL_RGBA, GL_UNSIGNED_BYTE, newImage.getData());

        return texture;
    }

}
