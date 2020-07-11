import { UiElement } from './element';

interface Props {
  lives: number
}

export class LivesElement extends UiElement {

  constructor(parent?: HTMLElement) {
    super(parent);
  }

  create(): void {
    this.elem = document.createElement('span');
    this.elem.id = 'lives';
  }

  update(props: Props): void {
    this.elem.innerText = props.lives.toString();
  }
}
