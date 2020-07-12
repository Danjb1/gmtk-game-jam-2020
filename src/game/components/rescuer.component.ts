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

    // Figure out:
    //  - How many cats are due to be picked up
    //  - Which cats are eligible to be picked up
    const catsDueForPickup: Entity[] = [];
    const catsEligibleForPickup: Entity[] = [];
    this.entity.context.getEntities().forEach(e => {
      const catMeta = <CatMetaComponent> e.getComponent(CatMetaComponent.KEY);

      if (!catMeta) {
        // Entity is not a cat
        return;
      }

      if (this._isInJail(e)) {
        catsEligibleForPickup.push(e);
      }

      if (catMeta.howCloseToPickup >= 1) {
        catsDueForPickup.push(e);
      }
    });

    // Try to pick up all the cats that are due for pickup
    catsDueForPickup.forEach(catDueForPickup => {
      const catDueForPickupMeta = <CatMetaComponent>
      catDueForPickup.getComponent(CatMetaComponent.KEY);

      // Just pick up any matching cat!
      const suitableCat = catsEligibleForPickup.find(catEligibleForPickup => {
        const catEligibleForPickupMeta = <CatMetaComponent>
            catEligibleForPickup.getComponent(CatMetaComponent.KEY);
        return catDueForPickupMeta.variety === catEligibleForPickupMeta.variety;
      });

      if (suitableCat) {
        this.pickUp(suitableCat);
      }
    });
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