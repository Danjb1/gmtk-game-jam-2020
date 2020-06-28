package engine;

import game.Launcher;

public abstract class State {

    protected Launcher launcher;
    protected GraphicsContext gfx;

    public State(Launcher launcher) {
        this.launcher = launcher;

        gfx = launcher.getGraphicsContext();
    }

    /**
     * Called when a State becomes active.
     */
    public void onLoad() {
        // Do nothing by default
    }

    /**
     * Called every frame.
     *
     * @param delta
     */
    public abstract void tick(int delta);

    /**
     * Called when a State is left.
     */
    public void destroy() {
        // Do nothing by default
    }

}
