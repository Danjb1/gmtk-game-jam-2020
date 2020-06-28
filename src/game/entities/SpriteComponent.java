package game.entities;

import engine.entities.EntityComponent;
import game.GameGraphics;
import game.Sprite;

public abstract class SpriteComponent extends EntityComponent {

    private GameGraphics gfx;
    private Sprite sprite;

    public SpriteComponent(GameGraphics gfx) {
        this.gfx = gfx;
    }

    protected abstract Sprite createSprite();

    @Override
    public void onSpawn() {
        super.onSpawn();

        sprite = createSprite();
        snapToEntity();

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

        snapToEntity();
    }

    private void snapToEntity() {
        // Update Sprite position based on the Entity position
        sprite.x = getX();
        sprite.y = getY();
    }

}
