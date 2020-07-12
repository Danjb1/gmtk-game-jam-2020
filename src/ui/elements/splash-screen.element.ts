import { UiElement } from "./element";


interface Props {

}

export class SplashScreenElement extends UiElement {
  constructor(parent?: HTMLElement) {
    super(parent);
  }

  create() {
    this.elem = (document.getElementById('splash') as HTMLTemplateElement).content.cloneNode(true) as HTMLElement;
  }

  update(props: Props) {

  }
}