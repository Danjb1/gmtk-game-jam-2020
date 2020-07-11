export class RandomUtils {

  public static intBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
  }

  public static randomSign(): number {
    return Math.random() < 0.5 ? -1 : 1;
  }

}
