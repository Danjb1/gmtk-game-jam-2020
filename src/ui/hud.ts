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

    const {score, lives } = this.game.getState();
    
    if (this.game.isGameOver()) {
      // We still need to update the lives to show the last one disappearing!
      this.livesElement.update({ lives });
      return;
    }

    this.pickup.update(this.game);
    
    this.scoreElement.update({ score });
    this.livesElement.update({ lives });
  }

}
