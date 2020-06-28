package game.io;

import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.SeekableByteChannel;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.lwjgl.BufferUtils;

public class ImageUtils {

    public static final int NUM_CHANNELS = 4; // RGBA

    /**
     * Copies image data to a target buffer.
     *
     * @param src
     * @param dst
     * @param srcX
     * @param srcY
     * @param width
     * @param height
     * @param dstX
     * @param dstY
     */
    public static void copyPixels(
            ImageData src,
            ImageData dst,
            int srcX,
            int srcY,
            int width,
            int height,
            int dstX,
            int dstY) {

        // Remember our position in the source buffer
        ByteBuffer srcData = src.getData();
        srcData.mark();

        // Remember our position in the target buffer
        ByteBuffer dstData = dst.getData();
        dstData.mark();

        for (int y = 0; y < height; y++) {

            // Move to the desired offset in our source buffer
            int srcRowStart = (srcY + y) * src.getWidth() * NUM_CHANNELS;
            int srcOffset = srcRowStart + srcX * NUM_CHANNELS;
            srcData.position(srcOffset);

            // Move to the desired y-offset in the target buffer
            int dstRowStart = (dstY + y) * dst.getWidth() * NUM_CHANNELS;
            int dstOffset = dstRowStart + dstX * NUM_CHANNELS;
            dstData.position(dstOffset);

            for (int x = 0; x < width; x++) {
                dstData.put(srcData.get()); // R
                dstData.put(srcData.get()); // G
                dstData.put(srcData.get()); // B
                dstData.put(srcData.get()); // A
            }
        }

        // Return to the marked positions
        srcData.reset();
        dstData.reset();
    }

    /**
     * Rounds up to the nearest power of 2.
     *
     * Taken from Bit Twiddling Hacks:
     * https://graphics.stanford.edu/~seander/bithacks.html#RoundUpPowerOf2
     *
     * "It works by copying the highest set bit to all of the lower bits, and
     * then adding one, which results in carries that set all of the lower bits
     * to 0 and one bit beyond the highest set bit to 1. If the original number
     * was a power of 2, then the decrement will reduce it to one less, so that
     * we round up to the same original value."
     *
     * @param num
     * @return
     */
    public static int roundToNextPowerOf2(int num) {
        num--;
        num |= num >> 1;
        num |= num >> 2;
        num |= num >> 4;
        num |= num >> 8;
        num |= num >> 16;
        num++;
        return num;
    }

    /**
     * Creates a blank image with the given dimensions.
     *
     * @param width
     * @param height
     * @return
     */
    public static ImageData createBlankImage(int width, int height) {
        int capacity = width * height * ImageUtils.NUM_CHANNELS;
        ByteBuffer buffer = BufferUtils.createByteBuffer(capacity);
        buffer.put(new byte[capacity]);
        buffer.flip();
        return new ImageData(width, height, buffer);
    }

    public static ByteBuffer loadRawData(String filename) throws IOException {
        return ioResourceToByteBuffer(filename, 1024 * 1024 * NUM_CHANNELS);
    }

    /**
     * Reads the specified resource and returns the raw data as a ByteBuffer.
     *
     * <p>Based on:
     * https://github.com/LWJGL/lwjgl3/blob/master/modules/samples/src/test/java/org/lwjgl/demo/util/IOUtil.java
     *
     * @param resource The resource to read
     * @param bufferSize The initial buffer size
     * @return The resource data
     *
     * @throws IOException If an IO error occurs
     */
    private static ByteBuffer ioResourceToByteBuffer(
            String resource, int bufferSize) throws IOException {

        ByteBuffer buffer;

        Path path = Paths.get(resource);
        if (Files.isReadable(path)) {
            try (SeekableByteChannel fc = Files.newByteChannel(path)) {
                buffer = BufferUtils.createByteBuffer((int) fc.size() + 1);
                while (fc.read(buffer) != -1) {
                    ;
                }
            }
        } else {
            try (
                InputStream source = ImageUtils.class.getClassLoader()
                        .getResourceAsStream(resource);
                ReadableByteChannel rbc = Channels.newChannel(source)
            ) {
                buffer = BufferUtils.createByteBuffer(bufferSize);

                while (true) {
                    int bytes = rbc.read(buffer);
                    if (bytes == -1) {
                        break;
                    }
                    if (buffer.remaining() == 0) {
                        // Increase capacity by 50%
                        buffer = resizeBuffer(buffer, buffer.capacity() * 3 / 2);
                    }
                }
            }
        }

        buffer.flip();

        return buffer.slice();
    }

    private static ByteBuffer resizeBuffer(ByteBuffer buffer, int newCapacity) {
        ByteBuffer newBuffer = BufferUtils.createByteBuffer(newCapacity);
        buffer.flip();
        newBuffer.put(buffer);
        return newBuffer;
    }

}
