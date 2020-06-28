package game.gl;

import static org.lwjgl.opengl.GL11.GL_FLOAT;
import static org.lwjgl.opengl.GL15.GL_ARRAY_BUFFER;
import static org.lwjgl.opengl.GL15.GL_DYNAMIC_DRAW;
import static org.lwjgl.opengl.GL15.glBindBuffer;
import static org.lwjgl.opengl.GL15.glBufferData;
import static org.lwjgl.opengl.GL15.glBufferSubData;
import static org.lwjgl.opengl.GL15.glGenBuffers;
import static org.lwjgl.opengl.GL20.glVertexAttribPointer;
import static org.lwjgl.opengl.GL30.glBindVertexArray;

import java.nio.FloatBuffer;
import java.util.Collection;
import java.util.List;

import org.lwjgl.BufferUtils;

import game.Sprite;
import game.shaders.TextureShader;

public class SpriteArrayDrawable extends Drawable {

    // x, y
    public static final int POSITION_SIZE = 2;

    // s, t
    public static final int TEX_COORD_SIZE = 2;

    private int positionVbo;
    private int texCoordVbo;

    private FloatBuffer positionData;
    private FloatBuffer texCoordData;

    public SpriteArrayDrawable(int maxImages) {

        int maxVertices = maxImages * GLUtils.VERTS_PER_QUAD;

        positionData = BufferUtils.createFloatBuffer(
                POSITION_SIZE * maxVertices);
        texCoordData = BufferUtils.createFloatBuffer(
                TEX_COORD_SIZE * maxVertices);
    }

    @Override
    protected void createVBOs(List<Integer> buffers) {

        positionVbo = glGenBuffers();
        texCoordVbo = glGenBuffers();

        glBindBuffer(GL_ARRAY_BUFFER, positionVbo);
        glBufferData(GL_ARRAY_BUFFER, positionData, GL_DYNAMIC_DRAW);
        glVertexAttribPointer(TextureShader.ATTR_VERTEX,
                POSITION_SIZE, GL_FLOAT, false, 0, 0);

        glBindBuffer(GL_ARRAY_BUFFER, texCoordVbo);
        glBufferData(GL_ARRAY_BUFFER, texCoordData, GL_DYNAMIC_DRAW);
        glVertexAttribPointer(TextureShader.ATTR_TEX_COORD,
                TEX_COORD_SIZE, GL_FLOAT, false, 0, 0);

        buffers.add(positionVbo);
        buffers.add(texCoordVbo);
    }

    public void update(Collection<Sprite> sprites) {

        // Prepare buffers for writing
        positionData.clear();
        texCoordData.clear();

        // Fill buffers
        numVertices = 0;
        fillBuffers(sprites);

        // Prepare buffers for reading
        positionData.flip();
        texCoordData.flip();

        // Bind our VAO
        glBindVertexArray(vao);

        // Send position data to GPU
        glBindBuffer(GL_ARRAY_BUFFER, positionVbo);
        glBufferSubData(GL_ARRAY_BUFFER, 0, positionData);

        // Send tex co-ord data to GPU
        glBindBuffer(GL_ARRAY_BUFFER, texCoordVbo);
        glBufferSubData(GL_ARRAY_BUFFER, 0, texCoordData);
    }

    private void fillBuffers(Collection<Sprite> sprites) {

        for (Sprite sprite : sprites) {

            numVertices += GLUtils.VERTS_PER_QUAD;

            fillPositionBuffer(sprite);
            fillTexCoordBuffer(sprite);
        }
    }

    /**
     * Adds a Sprite to the position buffer.
     *
     * @param sprite
     */
    protected void fillPositionBuffer(Sprite sprite) {

        float x1 = sprite.x;
        float y1 = sprite.y;
        float x2 = sprite.x + sprite.width;
        float y2 = sprite.y + sprite.height;

        positionData
                .put(x1).put(y1)
                .put(x1).put(y2)
                .put(x2).put(y2)
                .put(x1).put(y1)
                .put(x2).put(y2)
                .put(x2).put(y1);
    }

    /**
     * Adds a Sprite to the texture co-ordinate buffer.
     *
     * @param sprite
     */
    protected void fillTexCoordBuffer(Sprite sprite) {

        // For now, just render the whole texture
        // TODO: Get the texture co-ords from the Sprite
        float tx1 = 0;
        float tx2 = 1;
        float ty1 = 0;
        float ty2 = 1;

        if (sprite.flipX) {
            // Swap the texture co-ordinates
            float tmp = tx1;
            tx1 = tx2;
            tx2 = tmp;
        }

        texCoordData
                .put(tx1).put(ty1)
                .put(tx1).put(ty2)
                .put(tx2).put(ty2)
                .put(tx1).put(ty1)
                .put(tx2).put(ty2)
                .put(tx2).put(ty1);
    }

}
