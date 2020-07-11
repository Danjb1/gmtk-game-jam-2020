import { Component } from '../component';

/**
 * Represents the property of scaring away nearby Entities which have a
 * ScaredComponent.
 */
export class ScarerComponent extends Component {

  public static readonly KEY = Symbol();

  constructor() {
    super(ScarerComponent.KEY);
  }
}
