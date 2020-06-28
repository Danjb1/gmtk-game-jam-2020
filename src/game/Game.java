package game;

import java.io.IOException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import engine.State;
import engine.entities.Entity;
import game.entities.player.Player;
import game.entities.player.PlayerSprite;
import game.gl.Texture;
import game.io.ImageData;
import game.io.ImageReader;
import game.io.Resources;
import game.io.TextureBuilder;

public class Game extends State {

    /**
     * Width of the game world.
     */
    public static final float WORLD_WIDTH = 800;

    /**
     * Height of the game world.
     */
    public static final float WORLD_HEIGHT = 600;

    /**
     * All Entities within the game world.
     *
     * <p>We use a LinkedHashMap to ensure a consistent iteration order.
     */
    private Map<Integer, Entity> entities = new LinkedHashMap<>();

    /**
     * Entities that have just been added to the game world.
     *
     * <p>We collect these in a separate list to prevent a
     * ConcurrentModificationException during entity processing. These are then
     * added to {@link #entities} each frame.
     */
    private List<Entity> pendingEntities = new ArrayList<>();

    /**
     * The next available ID to assign to an Entity.
     */
    private int nextEntityId = 0;

    private Texture spriteTexture;

    public Game(Launcher launcher) {
        super(launcher);
    }

    @Override
    public void onLoad() throws Exception {
        super.onLoad();

        initTextures();
        initPlayer();
    }

    private void initTextures() throws IOException {
        ImageData imgData = ImageReader.loadImage(
                Resources.SPRITE_DIR + "sprites.png", true);
        spriteTexture = TextureBuilder.createTexture(imgData);
    }

    private void initPlayer() {
        Player player = new Player();
        player.addComponent(
                new PlayerSprite((GameGraphics) gfx, spriteTexture));
        addEntity(100, 100, player);
    }

    /**
     * Cleans up the Game before exiting.
     */
    @Override
    public void destroy() {

        // Destroy all Entities
        for (Entity entity : entities.values()) {
            entity.destroy();
        }
    }

    /**
     * Adds an Entity to the game world.
     *
     * <p>Results in a callback to
     * {@link Entity#addedToWorld(float, float, int)}.
     *
     * @param x
     * @param y
     * @param entity
     */
    public void addEntity(float x, float y, Entity entity) {
        pendingEntities.add(entity);
        entity.addedToWorld(x, y, nextEntityId);
        nextEntityId++;
    }

    /**
     * Ticks the game using the given delta value.
     *
     * @param delta
     */
    @Override
    public void tick(int delta) {

        // Update all Entities
        for (Entity entity : entities.values()) {
            entity.update(delta);
        }

        detectCollisions();

        // Add to our map any Entities that were just created
        for (Entity entity : pendingEntities) {
            entities.put(entity.id, entity);
        }
        pendingEntities.clear();

        // Remove any Entities that have been marked for deletion
        List<Entity> entitiesToDelete = entities.values().stream()
                .filter(e -> e.isDeleted())
                .collect(Collectors.toList());
        for (Entity entityToDelete : entitiesToDelete) {
            entityToDelete.destroy();
            entities.remove(entityToDelete.id);
        }
    }

    private void detectCollisions() {
        List<Entity> entityList = new ArrayList<>(entities.values());

        // Check for collisions between every pair of Entities
        for (int i = 0; i < entityList.size(); i++) {

            Entity e1  = entityList.get(i);
            if (e1.isDeleted()) {
                continue;
            }

            for (int j = i + 1; j < entityList.size(); j++) {

                Entity e2 = entityList.get(j);
                if (e2.isDeleted()) {
                    continue;
                }

                if (e1.hitbox.intersects(e2.hitbox)) {
                    e1.collidedWith(e2);
                    e2.collidedWith(e1);
                }

                if (e1.isDeleted()) {
                    // Entity has been deleted as the result of a collision
                    break;
                }
            }
        }
    }

}
