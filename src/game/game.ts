import { Assets } from './assets';
import { Entity } from './entity';
import { SpriteComponent, HitboxComponent, InputComponent } from './components';

export class Game {

  private entities: Entity[] = [];

  constructor(private app: PIXI.Application) {}

  /**
   * Initialises the game.
   *
   * @param callbackFn Function to call when the game is loaded.
   */
  load(callbackFn: any): void {
    Assets.loadTextures(this.app.loader, () => {
      this.setup();
      callbackFn();
    });
  }

  /**
   * Called when our Textures have finished loading.
   */
  setup(): void {
    this.initEntities();
  }

  /**
   * Creates our initial Entities.
   */
  initEntities(): void {
    const player = new Entity()
        .attach(new HitboxComponent(64, 64, 100, 100))
        .attach(new SpriteComponent('player.png', this.app.stage))
        .attach(new InputComponent([
          {name: 'Up', value: 'w'},
          {name: 'Down', value: 's'},
          {name: 'Left', value: 'a'},
          {name: 'Right', value: 'd'}
        ]));
    this.addEntity(player);
  }

  /**
   * Adds an Entity to the world.
   */
  addEntity(e: Entity): void {
    e.spawn();
    this.entities.push(e);
  }

  /**
   * Updates the game by one frame.
   *
   * @param delta Amount of fractional lag between frames:
   *
   *  1 = frame is exactly on time
   *  2 = frame has taken twice as long as expected
   */
  update(delta: number): void {

    // Update our Entities.
    // We make a copy of the array in case the list is changed during iteration.
    [...this.entities].forEach(e => {
      e.update(delta);
    });

    // Destroy deleted Entities
    this.entities
        .filter(e => e.deleted)
        .forEach(e => e.destroy());

    // Remove deleted Entities
    this.entities = this.entities.filter(e => !e.deleted);
  }

}
