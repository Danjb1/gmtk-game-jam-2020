import { UiElement } from './element';

interface Props {
  score: number
}

export class ScoreElement extends UiElement {

  constructor(parent?: HTMLElement) {
    super(parent);
  }

  private _prevContent:string;

  create(): void {
    this.elem = document.createElement('span');
  }

  update(props: Props): void {
    const newContent = `£${props.score}`;
    if (newContent === this._prevContent){
      return;
    }
    this._prevContent = newContent;
    this.elem.innerText = newContent;
  }
}
