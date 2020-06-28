package game.entities.player;

import engine.entities.Entity;
import engine.entities.Hitbox;

public class Player extends Entity {

    // Size, in world units
    private static final float WIDTH = 32;
    private static final float HEIGHT = 32;

    @Override
    protected Hitbox createHitbox(float x, float y) {
        return new Hitbox(x, y, WIDTH, HEIGHT);
    }

}
