package game;

import java.io.IOException;

import engine.GraphicsContext;
import engine.Input;
import engine.State;
import engine.Window;
import game.shaders.TextureShader;

public class Launcher {

    /**
     * Desired frames per second.
     */
    private static final int FPS = 60;

    /**
     * Timestep used to tick the game each frame.
     *
     * <p>We use a fixed time step to keep our physics consistent.
     */
    private static final int MS_PER_FRAME = 1000 / FPS;

    /**
     * Minimum interval used when sleeping the main Thread.
     *
     * <p>If this is set to a very small value (e.g. 1), we will get closer to
     * our desired framerate, but there is a higher risk of "oversleeping".
     *
     * <p>If this is set to a larger value (e.g. 4), each frame is more likely
     * to arrive a little early. We rectify this by busy-waiting between frames.
     */
    private static final int MIN_SLEEP_TIME = 4;

    private static final int WINDOW_WIDTH = 800;
    private static final int WINDOW_HEIGHT = 600;

    private Input input = new GameInput();
    private Window window;
    private State state;

    public void start() throws IOException {

        // Create the display
        window = new Window(WINDOW_WIDTH, WINDOW_HEIGHT, "Game", input);
        window.use();

        // Any initialisation that relies on an OpenGL context goes here
        initShaders();

        // Create a GraphicsContext to render what our Camera sees to a
        // Viewport. In this case the viewport fills the screen and the Camera
        // can see the entire game world.
        Rectangle viewport = new Rectangle(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
        Camera camera = new Camera(Game.WORLD_WIDTH, Game.WORLD_HEIGHT);
        window.setGraphicsContext(new GameGraphics(viewport, camera));

        // Start in the Game state
        changeState(new Game(this));

        /*
         * Start our game loop.
         *
         * Not the most sophisticated game loop in the world, but it gives
         * us a pretty steady 60fps.
         */
        long msBefore = System.currentTimeMillis();
        long msAfter = System.currentTimeMillis();
        while (window.isOpen()) {

            msBefore = System.currentTimeMillis();

            state.tick(MS_PER_FRAME);
            window.draw();

            // Calculate how much time until the next frame is due
            msAfter = System.currentTimeMillis();
            int timeTaken = (int) (msAfter - msBefore);
            int timeRemaining = MS_PER_FRAME - timeTaken;

            // Always sleep at least once so we're not hogging the CPU
            timeRemaining = Math.max(timeRemaining, MIN_SLEEP_TIME);

            // Sleep until the next frame is due.
            // We sleep in short intervals because the OS gives us no
            // guarantees about the sleep duration, and we don't want to
            // risk overshooting.
            while (timeRemaining > MIN_SLEEP_TIME) {
                try {

                    Thread.sleep(MIN_SLEEP_TIME);

                    // Recalculate the time remaining
                    msAfter = System.currentTimeMillis();
                    timeTaken = (int) (msAfter - msBefore);
                    timeRemaining = MS_PER_FRAME - timeTaken;

                } catch (InterruptedException ex) {
                    break;
                }
            }

            // If we have finished this frame early, busy-wait until the
            // next frame is due
            while (timeRemaining > 0) {
                msAfter = System.currentTimeMillis();
                timeTaken = (int) (msAfter - msBefore);
                timeRemaining = MS_PER_FRAME - timeTaken;
            }
        }

        // Clean up before exiting
        state.destroy();
        window.destroy();
    }

    private void initShaders() {
        try {
            TextureShader.init();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public void changeState(State newState) {

        // Destroy the old state
        if (state != null) {
            state.destroy();
        }

        // Load the new state
        state = newState;
        try {
            newState.onLoad();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public GraphicsContext getGraphicsContext() {
        return window.getGraphicsContext();
    }

}
