package game.io;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.IntBuffer;

import org.lwjgl.stb.STBImage;
import org.lwjgl.system.MemoryStack;

public class ImageReader {

    /**
     * Loads an image from a file.
     *
     * @param filename
     * @param useOpenGlOrigin Whether to flip the image vertically on load.
     *
     * <p>This can be useful for the sake of consistency, since whenever we
     * render to a framebuffer the resulting texture has its origin in the
     * bottom-left.
     *
     * @return
     * @throws IOException
     */
    public static ImageData loadImage(String filename, boolean useOpenGlOrigin)
            throws IOException {

        // STB can't load from a JAR so we first load the image to memory
        ByteBuffer inputBuffer = ImageUtils.loadRawData(filename);

        ImageData imageData;

        try (MemoryStack stack = MemoryStack.stackPush()) {

            IntBuffer width = stack.mallocInt(1);
            IntBuffer height = stack.mallocInt(1);
            IntBuffer channels = stack.mallocInt(1);

            STBImage.stbi_set_flip_vertically_on_load(useOpenGlOrigin);

            // Load image
            ByteBuffer buffer = STBImage.stbi_load_from_memory(
                    inputBuffer,
                    width,
                    height,
                    channels,
                    ImageUtils.NUM_CHANNELS);

            if (buffer == null) {
                throw new RuntimeException("Failed to load image: "
                        + filename
                        + " (" + STBImage.stbi_failure_reason() + ")");
            }

            imageData = new ImageData(width.get(), height.get(), buffer);
        }

        return imageData;
    }

}
