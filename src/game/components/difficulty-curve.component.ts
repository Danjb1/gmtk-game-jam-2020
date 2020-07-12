import { Component } from '../component';
import { SpawnerComponent } from './spawner.component';
import { Entity } from '../entity';
import { easeInBounce } from '../utils';

export class DifficultyCurveComponent extends Component {

  private static readonly KEY = Symbol();

  private _duration = 120000;

  private cfg: any;
  private _spawner: SpawnerComponent;
  private _attachedAt: number;
  private _difficultyModifier = 0;

  constructor(config: any) {
    super(DifficultyCurveComponent.KEY);
    this.cfg = config;
    this._difficultyModifier = this.cfg.difficulty.modifier;
    this._duration = this.cfg.difficulty.adjustInterval;
  }

  onAttach(entity: Entity) {
    super.onAttach(entity);
    this._spawner = entity.getComponent<SpawnerComponent>(SpawnerComponent.KEY);

    this._attachedAt = Date.now();
  }

  private adjustedValue(min: number, max: number, floor = false): number {
    const outputVal = ((max - min) * this._difficultyModifier) + min;
    return floor ? Math.floor(outputVal) : outputVal;
  }

  update() {
    const t = Math.min(((Date.now() - this._attachedAt) / this._duration), 1);
    this._difficultyModifier = easeInBounce(t);

    this._spawner.cfg = {
      interval: this.adjustedValue(
        this.cfg.catSpawnerConfig.interval.min,
        this.cfg.catSpawnerConfig.interval.max,
        true
      ),
      chanceToSpawn: this.adjustedValue(
        this.cfg.catSpawnerConfig.chanceToSpawn.min,
        this.cfg.catSpawnerConfig.chanceToSpawn.max
      ),
      attemptsPerInterval: 2,
      maxChildren: this.adjustedValue(
        this.cfg.catSpawnerConfig.maxChildren.min,
        this.cfg.catSpawnerConfig.maxChildren.max,
        true
      )
    };
  }

}
