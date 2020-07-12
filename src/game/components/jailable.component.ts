import { Component } from '../component';

export class JailableComponent extends Component {

  public static readonly KEY = Symbol();

  constructor() {
    super(JailableComponent.KEY);
  }

  public disabled = false
  disable(duration = 500){
    this.disabled = true;
    setTimeout(() => {
      this.disabled = false;
    }, duration);
  }

}
