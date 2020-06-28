package game.gl;

import static org.lwjgl.opengl.GL15.glDeleteBuffers;
import static org.lwjgl.opengl.GL30.glBindVertexArray;
import static org.lwjgl.opengl.GL30.glDeleteVertexArrays;
import static org.lwjgl.opengl.GL30.glGenVertexArrays;

import java.util.ArrayList;
import java.util.List;

/**
 * Class that "owns" a VAO and associated VBOs.
 */
public abstract class Drawable {

    protected int vao;
    protected int numVertices;

    private List<Integer> vbos = new ArrayList<>();

    private boolean initialised;

    /**
     * Initialises this Drawable.
     *
     * <p>This should be called precisely once, from the main thread.
     */
    public void initialise() {

        if (initialised) {
            throw new IllegalStateException(
                    "VertexArrayBuilder already initialised");
        }

        // Generate and bind to our VAO
        vao = glGenVertexArrays();
        glBindVertexArray(vao);

        // Get buffers to generate
        createVBOs(vbos);

        initialised = true;
    }

    /**
     * Determines if this Drawable has been initialised.
     *
     * @return
     */
    public boolean isInitialised() {
        return initialised;
    }

    /**
     * Creates the required VBOs.
     *
     * @param buffers
     */
    protected abstract void createVBOs(List<Integer> buffers);

    /**
     * Destroys this Drawable and the underlying VAO / VBOs.
     */
    public void destroy() {

        for (int buffer : vbos) {
            glDeleteBuffers(buffer);
        }

        glDeleteVertexArrays(vao);
    }

    public int getVao() {
        return vao;
    }

    public int getNumVertices() {
        return numVertices;
    }

}
