export class Vector {
  constructor(public x: number, public y: number) {}

  plus(other: Vector): Vector {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  minus(other: Vector): Vector {
    return new Vector(this.x - other.y, this.y - other.y);
  }
}
