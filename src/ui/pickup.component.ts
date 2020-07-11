import { Game } from "../game/game";
import { CatMetaComponent } from "../game/components";

export class PickupElement {
    
    private canvas: HTMLCanvasElement;
    public catMetaDataComponents = new Array<CatMetaComponent>();
    public catHeights = new Map<number, number>();
    private game: Game;
    private image: HTMLImageElement;
    private loaded = false;

    constructor(game: Game) {
        this.game = game;
        this.image = new Image();
        this.image.src = '../assets/images/player.png';
        this.image.onload = () => {
            this.loaded = true;
        };
    }
    
    public create(): HTMLCanvasElement {
        let canvas = document.createElement('pickupCanvas') as HTMLCanvasElement;
        canvas.innerHTML = '<canvas id="pickupCanvas" width="800" height="50" style="border:1px solid #d3d3d3; display: block; margin: auto;">';
        canvas.height = 50;
        canvas.width = 800;
        return canvas;
    }

    public update() {

        if (!this.loaded) {
            return;
        }

        let catMetaDataComponents = this.game.getEntities()
                                            .filter(entity => entity.getComponent(CatMetaComponent.KEY))
                                            .map(entity => entity.getComponent(CatMetaComponent.KEY));

        this.catMetaDataComponents = (catMetaDataComponents as Array<CatMetaComponent>).filter(c => c.howCloseToPickup !== 1);
        this.progress();
    }

    progress() {
        var canvas = document.getElementById("pickupCanvas") as HTMLCanvasElement;
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, 800, 50);
        context.beginPath();

        [...this.catMetaDataComponents].forEach(cat => {
            this.moveCatAlongProgressBar(cat, context);
        });

        context.stroke();
    }
    
    moveCatAlongProgressBar(cat: CatMetaComponent, context: CanvasRenderingContext2D) {
        let width = 800 * cat.howCloseToPickup;
        context.drawImage(this.image, width, cat.value / 4);
    }

    getRandomHeight() {
        return Math.random() * (51 - 1) + 1;
    }
}