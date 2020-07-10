export class Game {

  /**
   * Updates the game.
   *
   * @param delta Amount of fractional lag between frames:
   *
   *  1 = frame is exactly on time
   *  2 = frame has taken twice as long as expected
   */
  update(delta: number) {
    console.log(delta);
  }

}
