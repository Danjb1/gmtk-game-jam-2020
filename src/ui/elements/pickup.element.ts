import { Game } from '../../game/game';
import { CatMetaComponent } from '../../game/components';
import { UiElement } from './element';

export class PickupElement extends UiElement {

  elem: HTMLCanvasElement;

  private context: CanvasRenderingContext2D;

  private static readonly HEIGHT = 50;
  private static readonly WIDTH = 800;
  private static readonly IMAGE_WIDTH = 16;
  private static readonly NUM_IMAGES = 2;

  public catMetaDataComponents = new Array<CatMetaComponent>();
  public catHeights = new Map<number, number>();

  private images: any = {};
  private imagesLoaded = 0;

  private skip = false;

  constructor(parent: HTMLElement) {
    super(parent);

    // TODO: We shouldn't load these again as Pixi has already loaded them!
    this.loadImage('grey', '../images/original/cats/grey/grey_face.png');
    this.loadImage('white', '../images/original/cats/white/white_face.png');
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
    this.context.clearRect(0, 0, PickupElement.WIDTH, PickupElement.HEIGHT);
    this.context.beginPath();

    [...this.catMetaDataComponents].forEach(cat => {

      let height: number;

      if (![...this.catHeights.keys()].includes(cat.entity.entityId)) {
        height = this.getRandomHeight();
        this.catHeights.set(cat.entity.entityId, height);
      } else {
        height = this.catHeights.get(cat.entity.entityId);
      }

      this.moveCatAlongProgressBar(cat, this.context, height);
    });

    this.context.stroke();
  }

  private moveCatAlongProgressBar(cat: CatMetaComponent, context: CanvasRenderingContext2D, height: number) {
    let width = (PickupElement.WIDTH * cat.howCloseToPickup) - PickupElement.IMAGE_WIDTH;
    const image = this.getImageForCat(cat);
    context.drawImage(image, width, height);
  }

  private getImageForCat(catMeta: CatMetaComponent): CanvasImageSource {
    return this.images[catMeta.variety];
  }

  private getRandomHeight() {
    return Math.random() * (35 - 0);
  }

  stop() {
    this.context.clearRect(0, 0, PickupElement.WIDTH, PickupElement.HEIGHT);
  }
}