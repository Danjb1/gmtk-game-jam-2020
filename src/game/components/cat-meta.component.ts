import { Component } from '../component';
import { boundedGaussianRandom } from '../utils';

export type CatPersonality = 'normal' | 'lazy' | 'hyper';
export type CatVariety = 'ash' | 'black' | 'brown' | 'ginger' | 'grey' | 'greywhite' | 'tan' | 'white';

export class CatMetaComponent extends Component {
  // Component symbol
  public static readonly KEY = Symbol();
  // Min value for the cat
  private static readonly MIN_VALUE = 30;
  // Max value for the cat
  private static readonly MAX_VALUE = 200;
  // Possible personalities for the cat
  private static readonly PERSONALITIES: CatPersonality[] = ['normal'];
  // Possible Breeds
  private static readonly VARIETIES: CatVariety[] = ['ash', 'black', 'brown', 'ginger', 'grey', 'greywhite', 'tan', 'white'];

  // min max for duration
  private static readonly MIN_DURATION = 5000;
  private static readonly MAX_DURATION = 10000;

  private static readonly CAN_BE_PICKED_UP_THRESHOLD = .9;

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
      CatMetaComponent.MIN_VALUE,
      CatMetaComponent.MAX_VALUE
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
    const howClose = ((Date.now() - this._added) / this._duration);
    // Min 1, max 1
    return Math.max(0, Math.min(1, howClose));
  }

  /**
   * Returns true if the cat can be picked up
   */
  get canBePickedUp(): boolean {
    const howCloseToPickupNow = this.howCloseToPickup;
    return howCloseToPickupNow > CatMetaComponent.CAN_BE_PICKED_UP_THRESHOLD;
  }

  // Duration in ms
  private _duration: number;

  private _generateDuration(): number {
    return boundedGaussianRandom(
      CatMetaComponent.MIN_DURATION,
      CatMetaComponent.MAX_DURATION
    );
  }
}