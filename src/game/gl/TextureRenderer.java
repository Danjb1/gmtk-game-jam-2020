package game.gl;

import static org.lwjgl.opengl.GL11.GL_TRIANGLES;
import static org.lwjgl.opengl.GL11.glDrawArrays;
import static org.lwjgl.opengl.GL13.GL_TEXTURE0;
import static org.lwjgl.opengl.GL13.glActiveTexture;
import static org.lwjgl.opengl.GL30.glBindVertexArray;

import game.shaders.ShaderProgram;
import game.shaders.TextureShader;

public class TextureRenderer {

    /**
     * Renders a VertexArray.
     *
     * @param texture
     * @param vao
     * @param numVertices
     */
    public static void render(Texture texture, int vao, int numVertices) {

        if (texture == null || numVertices == 0) {
            return;
        }

        // Switch to our shader program
        ShaderProgram shader = TextureShader.get();
        shader.use();

        // Set the active texture unit to 0
        glActiveTexture(GL_TEXTURE0);

        // Bind our texture
        texture.bind();

        // Tell the shader to sample from texture unit 0
        shader.setUniform1i(TextureShader.UNIFORM_TEX, 0);

        // Bind our vertex array
        glBindVertexArray(vao);

        // Enable vertex attributes
        shader.enableVertexAttributeArray(TextureShader.ATTR_VERTEX);
        shader.enableVertexAttributeArray(TextureShader.ATTR_TEX_COORD);
        shader.enableVertexAttributeArray(TextureShader.ATTR_COLOUR);

        // Draw the vertices
        glDrawArrays(GL_TRIANGLES, 0, numVertices);

        // Disable vertex attributes
        shader.disableVertexAttributeArray(TextureShader.ATTR_VERTEX);
        shader.disableVertexAttributeArray(TextureShader.ATTR_TEX_COORD);
        shader.disableVertexAttributeArray(TextureShader.ATTR_COLOUR);

        // Unbind vertex array
        glBindVertexArray(0);
    }

}
