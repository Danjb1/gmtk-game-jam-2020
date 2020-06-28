package game.shaders;

import static org.lwjgl.opengl.GL11.GL_NO_ERROR;
import static org.lwjgl.opengl.GL11.GL_TRUE;
import static org.lwjgl.opengl.GL11.glGetError;
import static org.lwjgl.opengl.GL20.GL_COMPILE_STATUS;
import static org.lwjgl.opengl.GL20.GL_FRAGMENT_SHADER;
import static org.lwjgl.opengl.GL20.GL_LINK_STATUS;
import static org.lwjgl.opengl.GL20.GL_VERTEX_SHADER;
import static org.lwjgl.opengl.GL20.glAttachShader;
import static org.lwjgl.opengl.GL20.glBindAttribLocation;
import static org.lwjgl.opengl.GL20.glCompileShader;
import static org.lwjgl.opengl.GL20.glCreateProgram;
import static org.lwjgl.opengl.GL20.glCreateShader;
import static org.lwjgl.opengl.GL20.glDeleteProgram;
import static org.lwjgl.opengl.GL20.glDeleteShader;
import static org.lwjgl.opengl.GL20.glDisableVertexAttribArray;
import static org.lwjgl.opengl.GL20.glEnableVertexAttribArray;
import static org.lwjgl.opengl.GL20.glGetProgramInfoLog;
import static org.lwjgl.opengl.GL20.glGetProgrami;
import static org.lwjgl.opengl.GL20.glGetShaderInfoLog;
import static org.lwjgl.opengl.GL20.glGetShaderi;
import static org.lwjgl.opengl.GL20.glGetUniformLocation;
import static org.lwjgl.opengl.GL20.glLinkProgram;
import static org.lwjgl.opengl.GL20.glShaderSource;
import static org.lwjgl.opengl.GL20.glUniform1i;
import static org.lwjgl.opengl.GL20.glUniform3fv;
import static org.lwjgl.opengl.GL20.glUniformMatrix4fv;
import static org.lwjgl.opengl.GL20.glUseProgram;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.FloatBuffer;
import java.util.HashMap;
import java.util.Map;

import game.io.Resources;

/**
 * Class representing a shader program to be run on the GPU.
 */
public class ShaderProgram {

    ////////////////////////////////////////////////////////////////////////////
    // ShaderException
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Exception thrown if any problems occur during shader construction.
     */
    public static class ShaderException extends IOException {

        private static final long serialVersionUID = 1L;

        public ShaderException(String message) {
            super(message);
        }

    }

    ////////////////////////////////////////////////////////////////////////////
    // Builder
    ////////////////////////////////////////////////////////////////////////////

    /**
     * Class responsible for building a shader program.
     */
    public static class Builder {

        /**
         * ID of the shader program under construction.
         */
        private int programId;

        /**
         * ID of the vertex shader.
         */
        private int vsId;

        /**
         * ID of the fragment shader.
         */
        private int fsId;

        /**
         * Locations of our uniform variables.
         */
        private Map<String, Integer> uniformLocations = new HashMap<>();

        /**
         * Creates a new program using the given vertex and fragment shader.
         *
         * @param vertexShader
         * @param fragmentShader
         * @return This Builder object, for call chaining.
         * @throws IOException
         */
        public Builder createProgram(String vertexShader, String fragmentShader)
                throws IOException {

            // Clear any pre-existing error flag
            glGetError();

            // Load shaders
            vsId = loadShader(vertexShader, GL_VERTEX_SHADER);
            fsId = loadShader(fragmentShader, GL_FRAGMENT_SHADER);

            // Create a new shader program that links both shaders
            programId = glCreateProgram();
            glAttachShader(programId, vsId);
            glAttachShader(programId, fsId);

            return this;
        }

        /**
         * Loads and compiles the given shader's source code.
         *
         * @param filename
         * @param type
         * @return
         * @throws IOException
         */
        private static int loadShader(String filename, int type)
                throws IOException {

            // Read a shader file
            String shaderSource = readFileToString(
                    Resources.SHADER_DIR + filename);

            // Compile shader source
            int shaderId = glCreateShader(type);
            glShaderSource(shaderId, shaderSource);
            glCompileShader(shaderId);
            if (glGetShaderi(shaderId, GL_COMPILE_STATUS) != GL_TRUE) {
                glDeleteShader(shaderId);
                throw new ShaderException(
                        "Error compiling shader " + filename + ": "
                                + glGetShaderInfoLog(shaderId));
            }

            return shaderId;
        }

        /**
         * Reads the given file into a String.
         *
         * @param filename
         * @return
         * @throws IOException
         */
        private static String readFileToString(String filename)
                throws IOException {

            InputStream is = Resources.getResourceAsStream(filename);

            StringBuilder sb = new StringBuilder();
            try (BufferedReader in =
                    new BufferedReader(new InputStreamReader(is))) {
                String nextLine;
                while ((nextLine = in.readLine()) != null) {
                    sb.append(nextLine);
                    sb.append(System.lineSeparator());
                }
            }
            return sb.toString();
        }

        /**
         * Binds the given shader parameter to the given attribute ID.
         *
         * @param attributeId
         * @param parameterName
         * @return This Builder object, for call chaining.
         */
        public Builder addAttribute(int attributeId, String parameterName) {
            glBindAttribLocation(programId, attributeId, parameterName);
            return this;
        }

        /**
         * Links and validates the current program.
         * @return This Builder object, for call chaining.
         * @throws ShaderException
         */
        public Builder linkAndValidate() throws ShaderException {

            glLinkProgram(programId);
            int success = glGetProgrami(programId, GL_LINK_STATUS);
            if (success != GL_TRUE) {
                glDeleteProgram(programId);
                throw new ShaderException("Error linking shader program: "
                        + glGetProgramInfoLog(programId));
            }

            // Now that we have our program, we can safely delete the shader
            // objects
            glDeleteShader(vsId);
            glDeleteShader(fsId);

            return this;
        }

        /**
         * Retrieves the location of a uniform variable for later use.
         *
         * @param key
         * @param parameterName
         * @return This Builder object, for call chaining.
         * @throws ShaderException
         */
        public Builder addUniform(String key, String parameterName)
                throws ShaderException{

            int loc = glGetUniformLocation(programId, parameterName);

            if (loc == -1) {
                glDeleteProgram(programId);
                throw new ShaderException(
                        "Unable to find uniform location: " + parameterName);
            }

            uniformLocations.put(key, loc);

            return this;
        }

        /**
         * Checks for any errors that may have arisen.
         *
         * @return This Builder object, for call chaining.
         * @throws ShaderException
         */
        public Builder errorCheck() throws ShaderException{

            // Check for errors
            int errorCode = glGetError();
            if (errorCode != GL_NO_ERROR) {
                throw new ShaderException(
                        "OpenGL error " + String.valueOf(errorCode)
                        + " during shader initialisation: "
                        + glGetProgramInfoLog(programId));
            }

            return this;
        }

        public ShaderProgram build() {
            return new ShaderProgram(this);
        }

    }

    ////////////////////////////////////////////////////////////////////////////
    // ShaderProgram
    ////////////////////////////////////////////////////////////////////////////

    private static int currentProgramId = 0;

    /**
     * ID of the compiled shader program.
     */
    private int programId;

    /**
     * Locations of our uniform variables.
     */
    private Map<String, Integer> uniformLocations = new HashMap<>();

    public ShaderProgram(Builder builder) {
        this.programId = builder.programId;
        this.uniformLocations = builder.uniformLocations;
    }

    public void destroy() {
        glDeleteProgram(programId);
    }

    /**
     * Starts using this ShaderProgram.
     */
    public void use() {
        if (currentProgramId == programId) {
            return;
        }
        currentProgramId = programId;
        glUseProgram(programId);
    }

    public void setUniform1i(String key, int i) {
        glUniform1i(uniformLocations.get(key), i);
}

    public void setUniformMatrix4f(String key, FloatBuffer fb) {
        glUniformMatrix4fv(uniformLocations.get(key), false, fb);
    }

    public void setUniform3f(String key, FloatBuffer fb) {
        glUniform3fv(uniformLocations.get(key), fb);
    }

    public void setUniformBool(String key, boolean b) {
        glUniform1i(uniformLocations.get(key), b ? 1 : 0);
    }

    public void enableVertexAttributeArray(int attributeId) {
        glEnableVertexAttribArray(attributeId);
    }

    public void disableVertexAttributeArray(int attributeId) {
        glDisableVertexAttribArray(attributeId);
    }

}
