import { Component } from "../component"
import { SpawnerComponent } from "./spawner.component";
import { Entity } from "../entity";
import { easeInBounce } from "../utils";

export class DifficultyCurveComponent extends Component {

  private static readonly KEY = Symbol();

  private readonly DURATION = 120000;

  private _spawner: SpawnerComponent;
  private _attachedAt: number;
  private _difficultyModifier = 0;

  constructor() {
    super(DifficultyCurveComponent.KEY);
  }

  onAttach(entity: Entity) {
    super.onAttach(entity);
    this._spawner = entity.getComponent(SpawnerComponent.KEY) as SpawnerComponent;

    this._attachedAt = Date.now();
  }

  private adjustedValue(min: number, max: number): number {
    return Math.floor(((max - min) * this._difficultyModifier) + min);
  }

  update() {
    const t = Math.min(  ((Date.now() - this._attachedAt) / this.DURATION), 1);
    this._difficultyModifier = easeInBounce(t);

    this._spawner.cfg = {
      interval: this.adjustedValue(2000, 1000),
      chanceToSpawn: .5,
      attemptsPerInterval: 2,
      maxChildren: this.adjustedValue(8, 50)
    };
  }

}
