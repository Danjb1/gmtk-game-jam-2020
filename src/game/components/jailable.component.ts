import { Component } from '../component';

export class JailableComponent extends Component {

  public static readonly KEY = Symbol();

  constructor() {
    super(JailableComponent.KEY);
  }

}
