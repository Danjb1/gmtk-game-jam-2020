import { Game } from '../game/game';
import { PickupComponent } from './pickup.component';

export class Hud {

  private pickup: PickupComponent;

  constructor(private game: Game) {

    // Pickup bar
    this.pickup = new PickupComponent(game);
    let div = document.getElementById('ui');
    div.appendChild(this.pickup.create());
  }

  update() {
    this.pickup.update();
  }

}