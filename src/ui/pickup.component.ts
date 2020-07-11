export class PickupComponent {

    private canvas: HTMLCanvasElement;

    constructor() {
        setInterval(() => this.moveAcrossTheScreen(), 10000);
    }

    public create(): HTMLCanvasElement {
        let canvas = document.createElement("pickupCanvas") as HTMLCanvasElement;
        canvas.innerHTML = "<canvas id=\"pickupCanvas\" width=\"800\" height=\"50\" style=\"border:1px solid #d3d3d3; display: block; margin: auto;\">";
        canvas.height = 50;
        canvas.width = 800
        return canvas;
    }

    moveAcrossTheScreen() {
        let time = 30;
        var canvas = document.getElementById("pickupCanvas") as HTMLCanvasElement;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(this.insertImage(), 1, 2);

    }

    insertImage(): CanvasImageSource {
        let image = new Image();
        image.src = '../assets/images/player.png';
        return image;
      }
      

}