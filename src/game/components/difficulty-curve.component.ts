import { Component } from "../component"
import { SpawnerComponent } from "./spawner.component";
import { Entity } from "../entity";
import { easeInBounce } from "../utils";

// Config
import cfg from '../config.json';

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

  private adjustedValue(min: number, max: number, floor = false): number {
    const outputVal = ((max - min) * this._difficultyModifier) + min;
    return floor ? Math.floor(outputVal) : outputVal;
  }

  update() {
    const t = Math.min(((Date.now() - this._attachedAt) / this.DURATION), 1);
    this._difficultyModifier = easeInBounce(t);

    this._spawner.cfg = {
      interval: this.adjustedValue(
        cfg.catSpawnerConfig.interval.min,
        cfg.catSpawnerConfig.interval.max,
        true
      ),
      chanceToSpawn: this.adjustedValue(
        cfg.catSpawnerConfig.chanceToSpawn.min,
        cfg.catSpawnerConfig.chanceToSpawn.max
      ),
      attemptsPerInterval: 2,
      maxChildren: this.adjustedValue(
        cfg.catSpawnerConfig.maxChildren.min,
        cfg.catSpawnerConfig.maxChildren.max,
        true
      )
    };
  }

}
