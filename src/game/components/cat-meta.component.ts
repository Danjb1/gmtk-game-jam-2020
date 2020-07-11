import { Component } from '../component';
import { boundedGaussianRandom } from '../utils';

export type CatPersonality = 'normal' | 'lazy' | 'hyper';
export type CatBreed = 'british-shorthair' | 'persian';

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
  private static readonly BREEDS: CatBreed[] = ['british-shorthair', 'persian'];

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
    this._breed = this._generateBreed();
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
  private _generateBreed(): CatBreed {
    return CatMetaComponent.BREEDS[
      Math.floor(Math.random() * CatMetaComponent.BREEDS.length)
    ];
  }

  private _breed: CatBreed;

  get breed(): CatBreed {
    return this._breed;
  }

}