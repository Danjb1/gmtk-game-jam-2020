import { Entity } from './entity';

/**
 * Class used to encapsulate some Entity behaviour.
 */
export abstract class Component {

  public deleted: boolean;

  public entity: Entity;

  constructor(private _key: Symbol) {}

  /**
   * Callback for when this Component is attached to an Entity.
   */
  public onAttach(e: Entity): void {
    this.entity = e;
  }

  /**
   * Callback for when the parent Entity is added to the world.
   *
   * Use this if you need access to the EntityContext, or any other Components.
   */
  public onSpawn(): void {
    // Do nothing by default
  }

  /**
   * Cleans up this Component.
   */
  public destroy(): void {
    // Do nothing by default
  }

  /**
   * Updates this Component by one frame, BEFORE collision handling.
   *
   * @param delta Milliseconds passed since last frame.
   */
  public update(delta: number): void {
    // Do nothing by default
  }

  /**
   * Updates this Component by one frame, AFTER collision handling.
   *
   * @param delta Milliseconds passed since last frame.
   */
  public lateUpdate(delta: number): void {
    // Do nothing by default
  }

  /**
   * Notifies this Component of an event.
   */
  public notify(event: any): void {
    // Do nothing by default
  }

  get key() {
    return this._key;
  }

}
