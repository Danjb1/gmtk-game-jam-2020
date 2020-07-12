import { Component } from './component';
import { EntityContext } from './entity-context';

/**
 * A thing that exists within the game world.
 *
 * This is essentially just a "bag of Components".
 */
export class Entity {

  public deleted: boolean;
  public context: EntityContext;
  public entityId: number;

  private components: Component[] = [];

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
  public spawn(context: EntityContext): void {
    this.context = context;
    this.components.forEach(c => c.onSpawn());
  }

  /**
   * Cleans up this Entity.
   */
  public destroy(): void {
    this.components.forEach(c => c.destroy());
  }

  /**
   * Updates this Entity by one frame, BEFORE collision handling.
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
   * Updates this Entity by one frame, AFTER collision handling.
   *
   * @param delta Milliseconds passed since last frame.
   */
  public lateUpdate(delta: number): void {

    // Update our Components.
    // We make a copy of the array in case the list is changed during iteration.
    [...this.components].forEach(c => {
      c.lateUpdate(delta);
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
  public getComponent<T extends Component>(key: Symbol): T {
    return this.components.find(c => c.key === key) as T;
  }

  /**
   * Notifies all Components of some event.
   */
  public broadcast(event: any): void {
    this.components
      .filter(c => !c.deleted)
      .forEach(c => c.notify(event));
  }

}
