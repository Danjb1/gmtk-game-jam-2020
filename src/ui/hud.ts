import { Game } from '../game/game';
import { PickupElement } from './pickup.element';
import { ScoreElement, LivesElement } from './elements/';

export class Hud {

  private pickup: PickupElement;

  private scoreElement: ScoreElement;
  private livesElement: LivesElement;

  private gameContainer: HTMLElement = document.getElementById('game-container');

  constructor(private game: Game) {

    // Pickup bar
    this.pickup = new PickupElement(game);
    const div = document.getElementById('ui');
    div.appendChild(this.pickup.create());

    // Score
    this.scoreElement = new ScoreElement(this.gameContainer);
    this.livesElement = new LivesElement(this.gameContainer);
  }

  update() {
    this.pickup.update();

    const {score, lives } = this.game.getState();

    this.scoreElement.update({ score });
    this.livesElement.update({ lives });
  }

}
