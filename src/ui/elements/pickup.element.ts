import { Game } from '../../game/game';
import { CatMetaComponent } from '../../game/components';
import { UiElement } from './element';
import { Assets } from '../../game/assets';

export class PickupElement extends UiElement {

  elem: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  private static readonly HEIGHT = 50;
  private static readonly WIDTH = 800;
  private static readonly IMAGE_WIDTH = 24;
  private static readonly NUM_IMAGES = 2;

  public catMetaDataComponents = new Array<CatMetaComponent>();
  public catHeights = new Map<number, number>();

  private images: { [key: string]: CanvasImageSource } = {};
  private imagesLoaded = 0;

  private skip = false;

  constructor(parent: HTMLElement) {
    super(parent);

    // TODO: We shouldn't load these again as Pixi has already loaded them!
    this.loadImage('bg', `${Assets.SPRITES_BASEPATH}/ui/progress-bar.png`);
    this.loadImage('grey', `${Assets.SPRITES_BASEPATH}/ui/grey_face.png`);
    this.loadImage('white', `${Assets.SPRITES_BASEPATH}/ui/white_face.png`);
    this.loadImage('black', `${Assets.SPRITES_BASEPATH}/ui/black_face.png`);
  }

  private loadImage(id: string, src: string) {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      this.imagesLoaded++;
      this.images[id] = image;
    };
  }

  public create() {
    this.elem = document.createElement('canvas');
    this.elem.setAttribute('height', `${PickupElement.HEIGHT}`);
    this.elem.setAttribute('width', `${PickupElement.WIDTH}`);
    this.context = this.elem.getContext('2d');
  }

  public update(game: Game) {
    if (this.imagesLoaded < PickupElement.NUM_IMAGES || this.skip) {
      return;
    }

    let catMetaDataComponents = game.getEntities()
      .filter(entity => entity.getComponent(CatMetaComponent.KEY))
      .map(entity => entity.getComponent(CatMetaComponent.KEY));

    this.catMetaDataComponents = (catMetaDataComponents as Array<CatMetaComponent>).filter(c => c.howCloseToPickup !== 1);
    this.progress();

    // Prevents unnessary updating
    this.skip = true;
    requestAnimationFrame(() => {
      this.skip = false;
    });
  }

  private progress() {
    this.clearCanvas();
    this.context.beginPath();

    [...this.catMetaDataComponents].forEach(cat => {

      let y: number;

      if (![...this.catHeights.keys()].includes(cat.entity.entityId)) {
        y = this.getRandomHeight();
        this.catHeights.set(cat.entity.entityId, y);
      } else {
        y = this.catHeights.get(cat.entity.entityId);
      }

      this.moveCatAlongProgressBar(cat, this.context, y);
    });

    this.context.stroke();
  }

  private moveCatAlongProgressBar(cat: CatMetaComponent, context: CanvasRenderingContext2D, y: number) {
    let x = (PickupElement.WIDTH * cat.howCloseToPickup) - PickupElement.IMAGE_WIDTH;
    const image: CanvasImageSource = this.getImageForCat(cat);
    context.drawImage(image, x, y, PickupElement.IMAGE_WIDTH, PickupElement.IMAGE_WIDTH);
  }

  private getImageForCat(catMeta: CatMetaComponent): CanvasImageSource {
    return this.images[catMeta.variety];
  }

  private getRandomHeight() {
    return Math.random() * (35 - 0);
  }

  clearCanvas() {
    const image = this.images['bg'];
    this.context.drawImage(image, 0, 0, PickupElement.WIDTH, PickupElement.HEIGHT);
  }

  stop() {
    this.clearCanvas();
  }
}