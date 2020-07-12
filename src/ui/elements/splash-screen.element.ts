import { UiElement } from './element';

interface Props {
  show: boolean;
}

export class SplashScreenElement extends UiElement {
  constructor(parent?: HTMLElement) {
    super(parent);
  }

  create() {
    this.elem = (document.getElementById('splash') as HTMLTemplateElement).content.firstElementChild.cloneNode(true) as HTMLElement;
  }

  update() {
    // intentionally blank
  }

  remove() {
    this.elem.remove();
  }
}