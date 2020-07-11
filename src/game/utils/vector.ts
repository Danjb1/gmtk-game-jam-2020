/**
 * Represents a 2D vector, which can either be a velocity or a position.
 */
export class Vector {
  constructor(public x: number, public y: number) {}

  static zero(): Vector {
    return new Vector(0, 0);
  }

  static between(a: Vector, b: Vector): Vector {
    return new Vector(b.x - a.x, b.y - a.y);
  }

  get magnitude(): number {
    return this.hypotenuse(Vector.zero());
  }

  plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  minus(other: Vector): Vector {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  times(scalar: number): Vector {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  /**
   * Gets the straight-line distance "to" another vector, mostly meaningful for
   * position vectors.
   */
  hypotenuse(other: Vector): number {
    return Math.sqrt(
      Math.pow((other.x - this.x), 2) + Math.pow((other.y - this.y), 2)
    );
  }

  /**
   * Scales this vector such that it has the given magnitude.
   */
  scaleToMagnitude(magnitude: number): Vector {
    const ratio = magnitude / this.magnitude;
    return new Vector(this.x * ratio, this.y * ratio);
  }

  /**
   * Scales this vector such that it has the given magnitude, or its current
   * magnitude - whichever is smaller.
   */
  capMagnitude(magnitude: number): Vector {
    return this.magnitude < magnitude
      ? new Vector(this.x, this.y)
      : this.scaleToMagnitude(magnitude);
  }
}
