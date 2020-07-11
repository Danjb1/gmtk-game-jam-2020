export class Assets {

  public static readonly IMAGE_DIR = '../../assets/images';

  public static loader: PIXI.Loader;

  /**
   * Preloads all the Textures required by the game.
   */
  public static loadTextures(loader: PIXI.Loader, callbackFn: any): void {
    Assets.loader = loader;
    loader
      .add([
        `${Assets.IMAGE_DIR}/player.png`
      ])
      .load(callbackFn);
  }

  /**
   * Retrieves a previously-loaded Texture.
   */
  static texture(filename: string): PIXI.Texture {
    return Assets.loader.resources[`${Assets.IMAGE_DIR}/${filename}`].texture;
  }

}
