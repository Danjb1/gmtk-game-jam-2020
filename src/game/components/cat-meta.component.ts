import { Component } from '../component';
import { boundedGaussianRandom, easeOutSine } from '../utils';

export type CatPersonality = 'normal' | 'lazy' | 'hyper';
export type CatVariety = 'newgrey';
// TO-DO add more cat varieties with the new sprites
// export type CatVariety = 'ash' | 'black' | 'brown' | 'ginger' | 'grey' | 'greywhite' | 'tan' | 'white';

export class CatMetaComponent extends Component {
  // Component symbol
  public static readonly KEY = Symbol();
  // Min value for the cat
  private static minValue = 30;
  // Max value for the cat
  private static maxValue = 200;
  // Possible personalities for the cat
  private static readonly PERSONALITIES: CatPersonality[] = ['normal'];
  // Possible Breeds
  // TO-DO add more varieties with the new sprites
  // private static readonly VARIETIES: CatVariety[] = ['ash', 'black', 'brown', 'ginger', 'grey', 'greywhite', 'tan', 'white'];
  private static readonly VARIETIES: CatVariety[] = ['newgrey'];

  // min max for duration
  private static minDuration = 15000;
  private static maxDuration = 70000;

  private static canBePickedUpThreshold = .9;

  public static configure(cfg: any) {
    this.minValue = cfg.minValue;
    this.maxValue = cfg.maxValue;
    this.minDuration = cfg.minDuration;
    this.maxDuration = cfg.maxDuration;
    this.canBePickedUpThreshold = cfg.canBePickedUpThreshold;
  }

  constructor() {
    super(CatMetaComponent.KEY);
    this._buildMetaData();
  }

  /**
   * Generates the metadata for the cat
   */
  private _buildMetaData() {
    this._value = this._generateValue();
    this._personality = this._generatePersonality();
    this._variety = this._generateVariety();
    this._duration = this._generateDuration();
  }

  /**
   * Value of the cat when it is collected
   */
  private _value: number;

  get value(): number {
    return this._value;
  }

  /**
   * Generates the value of the cat
   * Uses a bell curve distribution for the value
   */
  private _generateValue(): number {
    return boundedGaussianRandom(
      CatMetaComponent.minValue,
      CatMetaComponent.maxValue
    );
  }

  /**
   * Randomly assigns a personality for the cat
   */
  private _generatePersonality(): CatPersonality {
    return CatMetaComponent.PERSONALITIES[
      Math.floor(Math.random() * CatMetaComponent.PERSONALITIES.length)
    ];
  }

  /**
   * Personality of the cat
   */
  private _personality: CatPersonality;

  get personality(): CatPersonality {
    return this._personality;
  }

  /**
   * Randomly assigns a breed
   */
  private _generateVariety(): CatVariety {
    return CatMetaComponent.VARIETIES[
      Math.floor(Math.random() * CatMetaComponent.VARIETIES.length)
    ];
  }

  private _variety: CatVariety;

  get variety(): CatVariety {
    return this._variety;
  }

  // When the cat is added
  private _added: number;

  onSpawn(): void {
    this._added = Date.now();
  }

  /**
   * How close to pickup
   *
   * 0 - just added
   * 1 - needs to be picked up
   */
  get howCloseToPickup(): number {
    let howClose = ((Date.now() - this._added) / this._duration);

    // Min 1, max 1
    howClose = Math.max(0, Math.min(1, howClose));

    // Add easing
    return easeOutSine(howClose);
  }

  /**
   * Returns true if the cat can be picked up
   */
  get canBePickedUp(): boolean {
    const howCloseToPickupNow = this.howCloseToPickup;
    return howCloseToPickupNow > CatMetaComponent.canBePickedUpThreshold;
  }

  // Duration in ms
  private _duration: number;

  private _generateDuration(): number {
    return boundedGaussianRandom(
      CatMetaComponent.minDuration,
      CatMetaComponent.maxDuration
    );
  }

  // If the cat is late being picked up
  private _late = false;
  public get late() {
    return this._late;
  }

  update() {
    if (!this.late && this.howCloseToPickup === 1) {
      this._late = true;
    }
  }

}