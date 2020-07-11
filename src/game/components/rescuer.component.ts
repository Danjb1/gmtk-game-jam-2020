import { Component } from '../component';
import { CatMetaComponent } from './cat-meta.component';
import { JailedComponent } from '.';
import { Entity } from '../entity';

/**
 * Handles a cat being picked up
 */
export class RescuerComponent extends Component {
  static readonly KEY = Symbol();

  constructor() {
    super(RescuerComponent.KEY);
  }

  private _isInJail(e: Entity): boolean {
    return !!e.getComponent(JailedComponent.KEY);
  }

  update() {

    let catsDueForPickup = 0;

    // Figure out:
    //  - How many cats are due to be picked up
    //  - Which cats are eligible to be picked up
    const catsEligibleForPickup: Entity[] = [];
    this.entity.context.getEntities().forEach(e => {
      const catMeta = <CatMetaComponent> e.getComponent(CatMetaComponent.KEY);
      if (catMeta) {
        if (this._isInJail(e)) {
          catsEligibleForPickup.push(e);
        }
        if (catMeta.howCloseToPickup >= 1) {
          catsDueForPickup++;
        }
      }
    });

    // Try to pick up that many cats (any cats will do!)
    for (let i = 0; i < catsDueForPickup; i++) {
      const cat = catsEligibleForPickup.pop();
      if (cat) {
        this.pickUp(cat);
      }
    }
  }

  private pickUp(cat: Entity) {

    const catMeta = <CatMetaComponent> cat.getComponent(CatMetaComponent.KEY);

    if (!catMeta.late) {
      // Add the cat's score to the game state
      this.entity.context
        .getState()
        .increaseScore(catMeta.value);
    }

    // Delete the cat
    cat.deleted = true;
  }

}