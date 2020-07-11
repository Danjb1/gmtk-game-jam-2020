import { Game } from '../game/game';
import { ScoreElement, LivesElement, PickupElement } from './elements/';

export class Hud {

  private pickup: PickupElement;

  private scoreElement: ScoreElement;
  private livesElement: LivesElement;

  private overlayElement: HTMLElement = document.getElementById('ui-overlay');

  constructor(private game: Game) {

    // Pickup bar
    const div = document.getElementById('ui');
    this.pickup = new PickupElement(div);
    this.pickup.update(game);

    // Score
    this.scoreElement = new ScoreElement(this.overlayElement);
    this.livesElement = new LivesElement(this.overlayElement);
  }

  update() {

    if (this.game.isGameOver()) {
      return;
    }

    this.pickup.update(this.game);

    const {score, lives } = this.game.getState();

    this.scoreElement.update({ score });
    this.livesElement.update({ lives });
  }

}
