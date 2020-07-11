import { Component } from '../component';
import { Entity } from '../entity';

interface KeyHandler {
  value: String;
  isDown: boolean;
  isUp: boolean;
  press?: Function;
  release?: Function;
  downHandler?: any;
  upHandler?: any;
  unsubscribe?: Function;
}

/**
 * Represents a key to bind to.
 */
export interface Binding {
  name: String;
  value: String;
}

/**
 * Component that permits listening to key events.
 */
export class InputComponent extends Component {

  public static readonly KEY = Symbol();
  private pressedKeys: Map<String, boolean>;

  constructor(private bindings: Binding[]) {
    super(InputComponent.KEY);
    this.pressedKeys = new Map();
  }

  onAttach(e: Entity) {
    super.onAttach(e);

    // Register controls
    this.bindings.forEach((binding: Binding) => {

      // Create handler
      const handler = this.registerKeyHandler(binding.value);

      // Add entry to keymap
      this.pressedKeys.set(binding.name, false);

      // Register handler callbacks
      handler.press = () => this.pressedKeys.set(binding.name, true);
      handler.release = () => this.pressedKeys.set(binding.name, false);
    });
  }

  /**
   * Does nothing, because key presses can occur at any time.
   */
  update(delta: number): void {}

  onSpawn(): void {}

  /**
   * Checks whether the key with the given name is currently pressed.
   */
  isPressed = (keyName: String) => this.pressedKeys.get(keyName);

  /**
   * Registers a handler for a certain key, returning a KeyHandler.
   *
   * Adapted from https://github.com/kittykatattack/learningPixi#keyboard.
   */
  private registerKeyHandler(value: String): KeyHandler {
    let keyHandler: KeyHandler = {
      value: value,
      isDown: false,
      isUp: true
    };

    keyHandler.downHandler = (event: any) => {
      if (event.key === keyHandler.value) {
        if (keyHandler.isUp && keyHandler.press) {
          keyHandler.press();
        }
        keyHandler.isDown = true;
        keyHandler.isUp = false;
        event.preventDefault();
      }
    };

    keyHandler.upHandler = (event: any) => {
      if (event.key === keyHandler.value) {
        if (keyHandler.isDown && keyHandler.release) {
          keyHandler.release();
        }
        keyHandler.isDown = false;
        keyHandler.isUp = true;
        event.preventDefault();
      }
    };

    // Create event listeners
    const downListener = keyHandler.downHandler.bind(keyHandler);
    const upListener = keyHandler.upHandler.bind(keyHandler);

    // Attach event listeners
    window.addEventListener('keydown', downListener, false);
    window.addEventListener('keyup', upListener, false);

    // Enable detachment of listeners
    keyHandler.unsubscribe = () => {
      window.removeEventListener('keydown', downListener);
      window.removeEventListener('keyup', upListener);
    };

    return keyHandler;
  }
}