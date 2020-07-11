import { Entity } from './entity';

/**
 * Class used to encapsulate some Entity behaviour.
 */
export abstract class Component {

  public deleted: boolean;

  private entity: Entity;

  /**
   * Callback for when this Component is attached to an Entity.
   *
   * Any initialisation should go inside here.
   */
  onAttach(e: Entity): void {
    this.entity = e;
  }

  /**
   * Cleans up this Component.
   */
  destroy(): void {
    // Do nothing by default
  }

  /**
   * Updates this Component by one frame.
   */
  update(delta: number): void {
    // Do nothing by default
  }

}
