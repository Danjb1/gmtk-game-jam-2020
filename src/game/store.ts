export class GameState {
  _lives = 3;
  get lives() {
    return this._lives;
  }
  looseLife() {
    this._lives--;
  }

  _score = 0;
  get score(){
    return this._score
  }

  increaseScore(amount: number){
    this._score += amount;
  }

}