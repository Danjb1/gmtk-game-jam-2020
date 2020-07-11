import * as createjs from 'createjs-module';

export class Assets {
  // public static readonly IMAGE_DIR = "../assets/images";
  public static readonly SPRITES_SRC = '../images/sprites.json';
  public static readonly SOUNDS_MANIFEST = '../sounds/manifest.json';
  public static readonly SOUNDS_BASEPATH = '../sounds/';

  public static loader: PIXI.Loader;

  /**
   * Preloads all the Textures required by the game.
   */
  public static async loadTexturesAsync(loader: PIXI.Loader): Promise<void> {
    console.log("Loading textures");

    // Save this loader for later, as it is needed to retrieve Textures
    Assets.loader = loader;
    await new Promise((res, rej) => {
      loader.onComplete.add(res);
      loader.onError.add(rej);
      loader.add(Assets.SPRITES_SRC).load();
    });
  }

  /**
   * Preloads all the Textures required by the game.
   */
  public static loadTextures(loader: PIXI.Loader, callbackFn: any): void {
    // Save this loader for later, as it is needed to retrieve Textures
    Assets.loader = loader;

    // Add an error callback
    loader.onError.add((err) => {
      console.error(err);
    });

    // Load our Textures
    loader.add(Assets.SPRITES_SRC).load(() => {
      callbackFn();
    });
  }

  public static async loadSoundsAsync(): Promise<void> {
    console.log("Loading sounds");
    await new Promise((res, rej) => {
      const queue = new createjs.LoadQueue(true, this.SOUNDS_BASEPATH);
      // queue.installPlugin(createjs.ManifestLoader);
      queue.installPlugin(createjs.Sound);
      queue.on("complete", this.preloadSoundsComplete); // This handler is never called and I don't know why!
      // queue.on("complete", res);
      queue.on("error", this.preloadSoundsError);       // Neither is this one
      // queue.on("error", rej);
      queue.loadManifest(Assets.SOUNDS_MANIFEST, true);
      queue.load();
    });
  }

  private static preloadSoundsComplete(event: any): void {
    console.log("Sounds loaded");
  }

  private static preloadSoundsError(err: any): void {
    console.error("Error loading sounds", err);
  }

  /**
   * Retrieves a previously-loaded Texture.
   */
  static texture(filename: string): PIXI.Texture {
    return Assets.loader.resources[Assets.SPRITES_SRC].textures[filename];
  }

  /**
   * Retrieves a previously-loaded Texture.
   */
  static spritesheet(): PIXI.Spritesheet {
    return Assets.loader.resources[Assets.SPRITES_SRC].spritesheet;
  }
}
