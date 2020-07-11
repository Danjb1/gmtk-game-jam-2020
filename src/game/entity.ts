import { Component } from './component';
import { EntityContext } from './entity-context';

/**
 * A thing that exists within the game world.
 *
 * This is essentially just a "bag of Components".
 */
export class Entity {

  public deleted: boolean;

  private components: Component[] = [];

  constructor(public entityContext: EntityContext) {}

  /**
   * Attaches a Component to this Entity.
   *
   * Results in a callback to `Component.onAttach`.
   */
  public attach(component: Component) {
    this.components.push(component);
    component.onAttach(this);
    return this;
  }

  /**
   * Called when this Entity is added to the world.
   *
   * By this point, all Components have been attached.
   */
  public spawn(): void {
    this.components.forEach(c => c.onSpawn());
  }

  /**
   * Cleans up this Entity.
   */
  public destroy(): void {
    this.components.forEach(c => c.destroy());
  }

  /**
   * Updates this Entity by one frame.
   *
   * @param delta Milliseconds passed since last frame.
   */
  public update(delta: number): void {

    // Update our Components.
    // We make a copy of the array in case the list is changed during iteration.
    [...this.components].forEach(c => {
      c.update(delta);
    });

    // Destroy deleted Components
    this.components
        .filter(c => c.deleted)
        .forEach(c => c.destroy());

    // Remove deleted Components
    this.components = this.components.filter(c => !c.deleted);
  }

  /**
   * Retrieves the first Component with the given key.
   */
  public getComponent(key: Symbol): Component {
    return this.components.find(c => c.key === key);
  }

}
