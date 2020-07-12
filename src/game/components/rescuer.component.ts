import { Component } from '../component';
import { CatMetaComponent } from './cat-meta.component';
import { JailedComponent } from '.';
import { Entity } from '../entity';
import { HitboxComponent } from './hitbox.component';
import { getHitboxFrom } from '../utils';

/**
 * Component that picks up a Cat when due.
 */
export class RescuerComponent extends Component {
  static readonly KEY = Symbol();

  constructor() {
    super(RescuerComponent.KEY);
  }

  private _isInJail(e: Entity): boolean {
    return !!e.getComponent(JailedComponent.KEY);
  }

  public update() {
    const cats = this.findAllCats();

    // Make lists of all the cats due / eligible for pickup
    const catsDueForPickup: Entity[] = [];
    const catsEligibleForPickup: Entity[] = [];
    cats.forEach(e => {

      if (this._isInJail(e)) {
        catsEligibleForPickup.push(e);
      }

      const catMeta = e.getComponent<CatMetaComponent>(CatMetaComponent.KEY);
      if (catMeta.canBePickedUp) {
        catsDueForPickup.push(e);
      }
    });

    // Try to pick up all the cats that are due for pickup
    catsDueForPickup.forEach(catDueForPickup => {
      const catDueForPickupMeta =
        catDueForPickup.getComponent<CatMetaComponent>(CatMetaComponent.KEY);

      // Just pick up any matching cat!
      const suitableCat = catsEligibleForPickup.find(catEligibleForPickup => {
        const catEligibleForPickupMeta =
          catEligibleForPickup.getComponent<CatMetaComponent>(CatMetaComponent.KEY);
        return catDueForPickupMeta.variety === catEligibleForPickupMeta.variety;
      });

      if (suitableCat) {
        this.pickUp(catDueForPickup, suitableCat);
      }
    });
  }

  private findAllCats(): Entity[] {
    return this.entity.context.getEntities().filter(
      e => (!!e.getComponent(CatMetaComponent.KEY))
    );
  }

  private pickUp(catDueForPickup: Entity, catInPen: Entity) {

    if (catDueForPickup !== catInPen) {

      // Swap the 2 cats so that the one being picked up is in the pen!
      // This disguises the fact that we are picking up any matching cat, not
      // necessarily the exact cat that was due.
      const h1: HitboxComponent = getHitboxFrom(catDueForPickup);
      const h2: HitboxComponent = getHitboxFrom(catInPen);
      this.swapHitboxes(h1, h2);

      // TODO: The cat that was in the pen should no longer be Jailed
      // TODO: The cat that is now in the pen should be Jailed
    }

    const catPickedUpMeta =
      catDueForPickup.getComponent<CatMetaComponent>(CatMetaComponent.KEY);

    if (!catPickedUpMeta.late) {
      // Add the cat's score to the game state
      this.entity.context
        .getState()
        .increaseScore(catPickedUpMeta.value);
    }

    // Delete the cat
    catDueForPickup.deleted = true;
  }

  private swapHitboxes(h1: HitboxComponent, h2: HitboxComponent): void {

    const x = h1.x;
    const y = h1.y;
    const speedX = h1.speedX;
    const speedY = h1.speedY;

    h1.x = h2.x;
    h1.y = h2.y;
    h1.speedX = h2.speedX;
    h1.speedY = h2.speedY;

    h2.x = x;
    h2.y = y;
    h2.speedX = speedX;
    h2.speedY = speedY;
  }

}
