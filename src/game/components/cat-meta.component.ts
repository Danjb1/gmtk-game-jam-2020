import { Component } from '../component';
import { boundedGaussianRandom } from '../utils/random';

type CatPersonality = 'normal' | 'lazy' | 'hyper';

export class CatMetaComponent extends Component {
  // Component symbol
  public static readonly KEY = Symbol();
  // Min value for the cat
  private static readonly MIN_VALUE = 30;
  // Max value for the cat
  private static readonly MAX_VALUE = 200;
  // Possible personalities for the cat
  private static readonly PERSONALITIES: CatPersonality[] = ['normal'];

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
   * Value of the cat when it is collected
   */
  private _value: number;

  get value(): number {
    return this._value;
  }

  /**
   * Personality of the cat
   */
  private _personality: CatPersonality;

  get personality(): CatPersonality {
    return this._personality;
  }

}