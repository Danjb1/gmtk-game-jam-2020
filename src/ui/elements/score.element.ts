import { UiElement } from './element';

interface Props {
  score: number
}

export class ScoreElement extends UiElement {

  constructor(parent?: HTMLElement) {
    super(parent);
  }

  create(): void {
    this.elem = document.createElement('span');
    this.elem.id = 'score';
  }

  update(props: Props): void {
    this.elem.innerText = `${props.score}`;
  }
}
