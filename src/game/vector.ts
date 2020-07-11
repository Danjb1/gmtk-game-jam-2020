/**
 * Represents a 2D vector, which can either be a velocity or a position.
 */
export class Vector {
  constructor(public x: number, public y: number) {}

  plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  minus(other: Vector): Vector {
    return new Vector(this.x - other.y, this.y - other.y);
  }

  hypotenuse(other: Vector): number {
    return Math.sqrt(
      Math.pow((other.x - this.x), 2) + Math.pow((other.y - this.y), 2)
    );
  }
}
