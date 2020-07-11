import { Component } from './component';

/**
 * A thing that exists within the game world.
 *
 * This is essentially just a "bag of Components".
 */
export class Entity {

  public deleted: boolean;

  private components: Component[] = [];

  /**
   * Attaches a Component to this Entity.
   *
   * Results in a callback to `Component.onAttach`.
   */
  attach(component: Component) {
    this.components.push(component);
    component.onAttach(this);
    return this;
  }

  /**
   * Cleans up this Entity.
   */
  destroy(): void {
    this.components.forEach(c => c.destroy());
  }

  /**
   * Updates this Entity by one frame.
   */
  update(delta: number): void {

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

  getComponent(condition: any): Component {
    return this.components.find(c => condition(c));
  }

}
