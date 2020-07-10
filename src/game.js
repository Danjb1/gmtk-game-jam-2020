export class Game {

  /**
   * Updates the game.
   *
   * @param {number} delta Milliseconds passed since the last frame.
   */
  update(delta) {
    this.render();
  }

  /**
   * Renders the game to the page.
   */
  render() {
    let canvas = document.getElementById('game-canvas');
    let ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgb(200, 0, 0)';
      ctx.fillRect(25, 25, 100, 100);
    }
  }

}
