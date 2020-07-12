export class Assets {

  public static readonly ASSETS_ROOT = '.';

  public static readonly SPRITES_BASEPATH = `${Assets.ASSETS_ROOT}/images`;
  public static readonly SPRITES_SRC = `${Assets.SPRITES_BASEPATH}/sprites.json`;
  public static readonly SOUNDS_BASEPATH = `${Assets.ASSETS_ROOT}/sounds`;

  public static loader: PIXI.Loader;

  /**
   * Preloads all the Textures required by the game.
   */
  public static loadTextures(loader: PIXI.Loader, callbackFn: any): void {

    // Save this loader for later, as it is needed to retrieve Textures
    Assets.loader = loader;

    // Add an error callback
    loader.onError.add((err) => console.error(err));

    // Load our Textures
    loader.add(Assets.SPRITES_SRC).load(() => callbackFn());
  }

  /**
   * Preloads all the sounds required by the game.
   */
  public static loadSounds(callbackFn: any): void {
    // TODO: Preload the sounds
    callbackFn();
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

  static playSound(filename: string): void {
    const audio = new Audio(`${Assets.SOUNDS_BASEPATH}/${filename}`);

    // Wait until the audio is playable
    audio.addEventListener('canplaythrough', event => {
      audio.play();
    });
  }
}
