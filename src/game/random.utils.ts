export class RandomUtils {

  public static intBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

}
