import { Game } from '../game/game';
import { ScoreElement, LivesElement, PickupElement, SplashScreenElement } from './elements/';

export class Hud {

  private pickup: PickupElement;

  private scoreElement: ScoreElement;
  private livesElement: LivesElement;
  private splashScreen: SplashScreenElement;

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

    if (!this.game.state.gameRunning) {
      this.pickup.stop();
      return;
    }

    this.pickup.update(this.game);

    const {score, lives, gameRunning} = this.game.getState();
    this.scoreElement.update({ score });
    this.livesElement.update({ lives });
  }
  

}
