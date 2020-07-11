import { Game } from "../../game/game";
import { CatMetaComponent } from "../../game/components";
import { UiElement } from "./element";

export class PickupElement extends UiElement {

  elem: HTMLCanvasElement;
  
  private context: CanvasRenderingContext2D;

  private static readonly HEIGHT = 50;
  private static readonly WIDTH = 800;
  private static readonly IMAGE_WIDTH = 16;

  public catMetaDataComponents = new Array<CatMetaComponent>();
  public catHeights = new Map<number, number>();

  private image: HTMLImageElement;
  private loaded = false;

  private skip = false;

  constructor(parent: HTMLElement) {
    super(parent);
    this.loadImage();
  }

  private loadImage() {
    this.image = new Image();
    this.image.src = '../assets/images/player.png';
    this.image.onload = () => {
      this.loaded = true;
    };
  }

  public create() {
    this.elem = document.createElement('canvas');
    this.elem.setAttribute('height', `${PickupElement.HEIGHT}`);
    this.elem.setAttribute('width', `${PickupElement.WIDTH}`);
    this.context = this.elem.getContext("2d");
  }

  public update(game: Game) {
    if (!this.loaded || this.skip) {
      return;
    }

    let catMetaDataComponents = game.getEntities()
      .filter(entity => entity.getComponent(CatMetaComponent.KEY))
      .map(entity => entity.getComponent(CatMetaComponent.KEY));

    this.catMetaDataComponents = (catMetaDataComponents as Array<CatMetaComponent>).filter(c => c.howCloseToPickup !== 1);
    this.progress();

    // Prevents unnessary updating
    this.skip = true;
    requestAnimationFrame(()=>{
      this.skip = false
    })
  }

  progress() {
    this.context.clearRect(0, 0, PickupElement.WIDTH, PickupElement.HEIGHT);
    this.context.beginPath();

    [...this.catMetaDataComponents].forEach(cat => {

      let height: number;

      if (![...this.catHeights.keys()].includes(cat.entity.entityId)) {
        height = this.getRandomHeight();
        this.catHeights.set(cat.entity.entityId, height)
      } else {
        height = this.catHeights.get(cat.entity.entityId);
      }

      this.moveCatAlongProgressBar(cat, this.context, height);
    });

    this.context.stroke();
  }

  moveCatAlongProgressBar(cat: CatMetaComponent, context: CanvasRenderingContext2D, height: number) {
    let width = (PickupElement.WIDTH * cat.howCloseToPickup) - PickupElement.IMAGE_WIDTH;
    context.drawImage(this.image, width, height);
  }

  getRandomHeight() {
    return Math.random() * (35 - 0);
  }
}