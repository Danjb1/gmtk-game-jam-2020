package game.entities;

import engine.entities.EntityComponent;
import game.GameGraphics;
import game.Sprite;
import game.gl.Texture;

public abstract class SpriteComponent extends EntityComponent {

    private GameGraphics gfx;
    private Sprite sprite;

    public SpriteComponent(
            GameGraphics gfx,
            Texture tex,
            int width,
            int height) {

        this.gfx = gfx;

        sprite = new Sprite(tex, width, height);
    }

    @Override
    public void onSpawn() {
        super.onSpawn();

        gfx.addSprite(sprite);
    }

    @Override
    public void destroy() {
        gfx.removeSprite(sprite);
    }

    /**
     * Gets the x-position at which this Sprite should be rendered, in world
     * units.
     *
     * @return
     */
    protected float getX() {
        return entity.hitbox.x;
    }

    /**
     * Gets the y-position at which this Sprite should be rendered, in world
     * units.
     *
     * @return
     */
    protected float getY() {
        return entity.hitbox.y;
    }

    @Override
    public void update(int delta) {
        super.update(delta);

        // Update Sprite position based on the Entity position
        sprite.x = getX();
        sprite.y = getY();
    }

}
