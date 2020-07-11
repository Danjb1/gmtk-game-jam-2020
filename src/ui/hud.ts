import { Game } from '../game/game';
import { PickupElement } from './pickup.component';
import { ScoreComponent } from './score.component';

export class Hud {

  private pickup: PickupElement;
  private scoreComponent: ScoreComponent;

  constructor(private game: Game) {

    // Pickup bar
    this.pickup = new PickupElement(game);
    const div = document.getElementById('ui');
    div.appendChild(this.pickup.create());

    // Score
    this.scoreComponent = new ScoreComponent(game.getState());
    const gameContainer = document.getElementById('game-container');
    gameContainer.appendChild(this.scoreComponent.create());
  }

  update() {
    this.pickup.update();
    this.scoreComponent.update();
  }

}
