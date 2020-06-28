package engine.entities;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public abstract class EntityComponent {

    /**
     * Entity to which this EntityComponent is attached.
     */
    protected Entity entity;

    /**
     * Child components managed by this EntityComponent.
     */
    protected List<EntityComponent> children = new ArrayList<>();

    protected boolean deleted;

    /**
     * Adds a child EntityComponent.
     *
     * @param child
     */
    public void addChild(EntityComponent child) {
        children.add(child);
        child.onAttach(entity);
    }

    /**
     * Callback for when this EntityComponent is attached to an Entity.
     *
     * @param entity
     */
    public void onAttach(Entity entity) {
        this.entity = entity;

        for (EntityComponent child : children) {
            child.onAttach(entity);
        }
    }

    /**
     * Callback for when the Entity is added to the world.
     */
    public void onSpawn() {
        for (EntityComponent child : children) {
            child.onSpawn();
        }
    }

    /**
     * Updates this EntityComponent and its children.
     *
     * @param delta
     */
    public void update(int delta) {
        for (EntityComponent child : children) {
            child.update(delta);
        }

        // Remove any EntityComponents that have been marked for deletion
        children.removeAll(children.stream()
                .filter(comp -> comp.isDeleted())
                .peek(comp -> comp.destroy())
                .collect(Collectors.toList()));

    }

    /**
     * Destroys this EntityComponent and its children.
     */
    public void destroy() {
        for (EntityComponent child : children) {
            child.destroy();
        }
    }

    /**
     * Marks this EntityComponent for deletion.
     */
    public void delete() {
        deleted = true;
    }

    /**
     * Determines if this EntityComponent has been deleted.
     *
     * <p>Deleted EntityComponents are removed from their parent each frame.
     *
     * @return
     */
    public boolean isDeleted() {
        return deleted;
    }

}
