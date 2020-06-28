package game.io;

import java.nio.ByteBuffer;

public class ImageData {

    private int width;
    private int height;
    private ByteBuffer data;

    public ImageData(int width, int height, ByteBuffer data) {
        this.width = width;
        this.height = height;
        this.data = data;
    }

    public int getWidth() {
        return width;
    }

    public int getHeight() {
        return height;
    }

    public ByteBuffer getData() {
        return data;
    }

}
