export class Assets {
  // public static readonly IMAGE_DIR = "../assets/images";
  public static readonly SPRITES_SRC = "../images/sprites.json";

  public static loader: PIXI.Loader;

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

  /**
   * Retrieves a previously-loaded Texture.
   */
  static texture(filename: string): PIXI.Texture {
    return Assets.loader.resources[Assets.SPRITES_SRC].textures[filename];
  }
}
