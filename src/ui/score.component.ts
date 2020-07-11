import { GameState } from '../game/store';

export class ScoreComponent {

  private elem: HTMLSpanElement;

  constructor(private state: GameState) {}

  public create(): HTMLElement {
    this.elem = document.createElement('span');
    this.elem.id = 'score';
    return this.elem;
  }

  public update(): void {
    this.elem.innerText = `$${this.state.score}`;
  }

}
