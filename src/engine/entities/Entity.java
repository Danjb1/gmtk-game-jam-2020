package engine.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import engine.Physics;
import game.Game;

/**
 * An object that exists within the game world.
 *
 * <p>Uses a component-based system to supplement basic functionality.
 */
public abstract class Entity {

    public Hitbox hitbox;

    public int id;

    protected boolean deleted;

    protected List<EntityComponent> components = new ArrayList<>();

    /**
     * Called when this Entity is added to the game world.
     *
     * <p>This should be used for any initialisation that depends upon the
     * Entity having a physical presence in the game world.
     *
     * @param y
     * @param x
     * @param id
     */
    public void addedToWorld(float x, float y, int id) {
        this.id = id;

        hitbox = createHitbox(x, y);

        for (EntityComponent component : components) {
            component.onSpawn();
        }
    }

    /**
     * Creates this Entity's Hitbox, thus defining its position and size.
     *
     * @param y
     * @param x
     * @return
     */
    protected abstract Hitbox createHitbox(float x, float y);

    /**
     * Destroys this Entity and its components.
     */
    public void destroy() {
        for (EntityComponent component : components) {
            component.destroy();
        }
    }

    /**
     * Adds an EntityComponent to this Entity.
     *
     * <p>Results in a callback to {@link EntityComponent#onAttach}.
     *
     * @param component
     */
    public void addComponent(EntityComponent component) {
        components.add(component);
        component.onAttach(this);
    }

    /**
     * Updates this Entity using the given delta value.
     *
     * @param delta Milliseconds passed since the last frame.
     */
    public void update(int delta) {

        // Update components
        for (EntityComponent component : components) {
            component.update(delta);
        }

        // Remove any EntityComponents that have been marked for deletion
        components.removeAll(components.stream()
                .filter(comp -> comp.isDeleted())
                .peek(comp -> comp.destroy())
                .collect(Collectors.toList()));

        move(delta);
        applyFriction(delta);
    }

    /**
     * Moves this Entity according to its current speed.
     *
     * @param delta
     */
    protected void move(int delta) {

        // Remember the position before any movement takes place.
        // This comes in handy during collision handling.
        hitbox.prevX = hitbox.x;
        hitbox.prevY = hitbox.y;

        // Calculate change in position for this frame
        float dx = (hitbox.speedX * delta) / 1000;
        float dy = (hitbox.speedY * delta) / 1000;

        // Move the Entity
        hitbox.x += dx;
        hitbox.y += dy;

        checkBounds();
    }

    /**
     * Detects when Entities go outside the world bounds.
     */
    private void checkBounds() {
        if (hitbox.x < 0) {
            collideWithLeftEdge();
        } else if (hitbox.x > Game.WORLD_WIDTH - hitbox.width) {
            collideWithRightEdge();
        }
        if (hitbox.y < 0) {
            collideWithTopEdge();
        } else if (hitbox.y > Game.WORLD_HEIGHT - hitbox.height) {
            collideWithBottomEdge();
        }
    }

    /**
     * Called every frame while this Entity exceeds the left world boundary.
     */
    protected void collideWithLeftEdge() {
        hitbox.x = 0;
        hitbox.speedX = -hitbox.speedX; // Bounce!
    }

    /**
     * Called every frame while this Entity exceeds the right world boundary.
     */
    protected void collideWithRightEdge() {
        hitbox.x = Game.WORLD_WIDTH - hitbox.width;
        hitbox.speedX = -hitbox.speedX; // Bounce!
    }

    /**
     * Called every frame while this Entity exceeds the top world boundary.
     */
    protected void collideWithTopEdge() {
        hitbox.y = 0;
        hitbox.speedY = -hitbox.speedY; // Bounce!
    }

    /**
     * Called every frame while the Entity exceeds the bottom world boundary.
     */
    protected void collideWithBottomEdge() {
        hitbox.y = Game.WORLD_HEIGHT - hitbox.height;
        hitbox.speedY = -hitbox.speedY; // Bounce!
    }

    /**
     * Applies friction.
     *
     * @param delta
     */
    protected void applyFriction(int delta) {
        float frictionThisFrame = (Physics.FRICTION * delta) / 1000;

        if (Math.abs(hitbox.speedX) - frictionThisFrame > 0) {
            hitbox.speedX -= Math.copySign(frictionThisFrame, hitbox.speedX);
        } else {
            hitbox.speedX = 0;
        }

        if (Math.abs(hitbox.speedY) - frictionThisFrame > 0) {
            hitbox.speedY -= Math.copySign(frictionThisFrame, hitbox.speedY);
        } else {
            hitbox.speedY = 0;
        }
    }

    /**
     * Marks this Entity for deletion.
     */
    public void delete() {
        deleted = true;
    }

    /**
     * Determines if this Entity has been deleted.
     *
     * <p>Deleted Entities are removed from the game world every frame and are
     * ignored in our collision detection.
     *
     * @return
     */
    public boolean isDeleted() {
        return deleted;
    }

    /**
     * Called when this Entity collides with another.
     *
     * <p>Note that both Entities receive this callback.
     *
     * @param other
     */
    public void collidedWith(Entity other) {
        // Do nothing by default
    }

}
