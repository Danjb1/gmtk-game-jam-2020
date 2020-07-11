export class GameState {

  _lives = 3;
  _score = 0;

  get lives() {
    return this._lives;
  }

  get score() {
    return this._score;
  }

  looseLife() {
    this._lives--;
  }

  increaseScore(amount: number){
    this._score += amount;
    console.log('SCORE UPDATED', this.score);
  }

}
