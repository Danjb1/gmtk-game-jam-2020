package game.shaders;

import java.io.IOException;

public class TextureShader {

    public static final String UNIFORM_VIEW_PROJ_MATRIX = "view_proj_matrix";
    public static final String UNIFORM_TEX = "tex";

    public static final int ATTR_VERTEX    = 0;
    public static final int ATTR_TEX_COORD = 1;

    private static final String VERTEX_SHADER = "texture.vert";
    private static final String FRAGMENT_SHADER = "texture.frag";

    private static ShaderProgram shader;

    public static void init() throws IOException {

        // Destroy the old shader
        if (shader != null) {
            shader.destroy();
        }

        shader = new ShaderProgram.Builder()
                .createProgram(VERTEX_SHADER, FRAGMENT_SHADER)
                .addAttribute(ATTR_VERTEX, "in_vertex")
                .addAttribute(ATTR_TEX_COORD, "in_tex_coord")
                .linkAndValidate()
                .addUniform(UNIFORM_VIEW_PROJ_MATRIX, "view_proj_matrix")
                .addUniform(UNIFORM_TEX, "tex")
                .errorCheck()
                .build();
    }

    public static ShaderProgram get() {
        return shader;
    }

}
