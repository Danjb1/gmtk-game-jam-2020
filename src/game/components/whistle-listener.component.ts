import { Component } from '../component';
import { JourneyComponent } from './journey.component';
import { WhistleListener, WhistlerComponent } from './whistler.component';

// Utils
import { Vector } from '../utils';

export class WhistleListenerComponent extends Component implements WhistleListener {

  public static readonly KEY = Symbol();

  constructor(private maxSpeed: number) {
    super(WhistleListenerComponent.KEY);
  }

  onSpawn(): void {
    this.entity.context
      .getEntities()
      .filter(entity => entity.getComponent<WhistlerComponent>(WhistlerComponent.KEY))
      .map(entity => entity.getComponent<WhistlerComponent>(WhistlerComponent.KEY))
      .forEach(comp => comp.addListener(this));
  }

  whistleHeard(location: Vector): void {

    // Terminate existing journey, if there is one
    const existingJourney =
        this.entity.getComponent<JourneyComponent>(JourneyComponent.KEY);
    if (existingJourney) {
      existingJourney.cease();
    }

    // Attach a new journey towards the new location
    this.entity.attach(new JourneyComponent(2 * this.maxSpeed, location));
  }
}
