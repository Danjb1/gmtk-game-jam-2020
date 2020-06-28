package engine;

import static org.lwjgl.glfw.GLFW.GLFW_CONTEXT_VERSION_MAJOR;
import static org.lwjgl.glfw.GLFW.GLFW_CONTEXT_VERSION_MINOR;
import static org.lwjgl.glfw.GLFW.GLFW_PRESS;
import static org.lwjgl.glfw.GLFW.GLFW_RELEASE;
import static org.lwjgl.glfw.GLFW.GLFW_RESIZABLE;
import static org.lwjgl.glfw.GLFW.glfwCreateWindow;
import static org.lwjgl.glfw.GLFW.glfwInit;
import static org.lwjgl.glfw.GLFW.glfwMakeContextCurrent;
import static org.lwjgl.glfw.GLFW.glfwPollEvents;
import static org.lwjgl.glfw.GLFW.glfwSetKeyCallback;
import static org.lwjgl.glfw.GLFW.glfwShowWindow;
import static org.lwjgl.glfw.GLFW.glfwSwapBuffers;
import static org.lwjgl.glfw.GLFW.glfwSwapInterval;
import static org.lwjgl.glfw.GLFW.glfwWindowHint;
import static org.lwjgl.glfw.GLFW.glfwWindowShouldClose;
import static org.lwjgl.opengl.GL11.GL_COLOR_BUFFER_BIT;
import static org.lwjgl.opengl.GL11.GL_FALSE;
import static org.lwjgl.opengl.GL11.glClear;

import org.lwjgl.opengl.GL;

public class Window {

    private long window;

    private int width;
    private int height;
    private String title;
    private Input input;

    private GraphicsContext gfx;

    public Window(int width, int height, String title, Input input) {
        this.width = width;
        this.height = height;
        this.title = title;
        this.input = input;
    }

    public void use() {

        if (!glfwInit()) {
            throw new IllegalStateException("Unable to initialize GLFW");
        }

        glfwWindowHint(GLFW_RESIZABLE, GL_FALSE);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 2);
        glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 1);

        window = glfwCreateWindow(width, height, title, 0, 0);
        if (window == 0) {
            throw new RuntimeException("Failed to create window");
        }

        glfwMakeContextCurrent(window);
        glfwSwapInterval(0);
        GL.createCapabilities();
        glfwShowWindow(window);

        setupInput();
    }

    private void setupInput() {
        glfwSetKeyCallback(window, (window, key, scancode, action, mods) -> {
            if (action == GLFW_PRESS) {
                input.keyPressed(key);
            } else if (action == GLFW_RELEASE) {
                input.keyReleased(key);
            }
        });
    }

    /**
     * Checks whether the window is still open.
     *
     * @return
     */
    public boolean isOpen() {
        return !glfwWindowShouldClose(window);
    }

    /**
     * Draws to the Window.
     */
    public void draw() {
        glfwPollEvents();
        glClear(GL_COLOR_BUFFER_BIT);
        gfx.render();
        glfwSwapBuffers(window);
    }

    public void destroy() {
        gfx.destroy();
    }

    public void setGraphicsContext(GraphicsContext gfx) {
        this.gfx = gfx;
    }

    public GraphicsContext getGraphicsContext() {
        return gfx;
    }

}
