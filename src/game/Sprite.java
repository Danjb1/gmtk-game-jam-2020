package game;

import game.gl.Texture;

public class Sprite {

    // The Texture containing this Sprite
    public Texture texture;

    // Position and size at which the Sprite should be rendered
    public float x;
    public float y;
    public float z; // TODO: Enable depth buffer and pass z to GPU
    public float width;
    public float height;

    // Whether the Sprite should be flipped
    public boolean flipX;
    public boolean flipY;

    public Sprite(Texture texture, float width, float height) {
        this.width = width;
        this.height = height;
    }

}
