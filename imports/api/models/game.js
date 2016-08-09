/**
 * GameStatus constants
 */
export const GameStatuses = {
  WAITING: 'WAITING',  // waiting player to join
  STARTED: 'STARTED',  // all spots are filled; can start playing
  FINISHED: 'FINISHED', // game is finished
  ABANDONED: 'ABANDONED' // all players left; game is abandoned
}

/**
 * Game model, encapsulating game-related logics
 * It is data store independent
 */
export class Game {
  /**
   * Constructor accepting a single param gameDoc.
   * gameDoc should contain the permanent fields of the game instance.
   * Normally, the fields are saved into data store, and later get retrieved
   *
   * If gameDoc is not given, then we will instantiate a new object with default fields
   *
   * @param {Object} [gameDoc] Optional doc retrieved from Games collection
   */
  constructor(gameDoc) {
    if (gameDoc) {
      _.extend(this, gameDoc);
    } else {
      this.status = GameStatuses.WAITING;
      this.board = [[null, null, null], [null, null, null], [null, null, null]];
      this.players = [];
    }
  }

/**
   * Return a list of fields that are required for permanent storage
   *
   * @return {[]String] List of fields required persistent storage
   */
  persistentFields() {
    return ['status', 'board', 'players'];
  }

/**
   * Handle join game action
   *
   * @param {User} user Meteor.user object
   */
  userJoin(user) {
    if (this.status !== GameStatuses.WAITING) {
      throw "cannot join at current state";
    }
    if (this.userIndex(user) !== null) {
      throw "user already in game";
    }

this.players.push({
      userId: user._id,
      username: user.username
    });

// game automatically start with 2 players
    if (this.players.length === 2) {
      this.status = GameStatuses.STARTED;
    }
  }

/**
   * Handle leave game action
   *
   * @param {User} user Meteor.user object
   */
  userLeave(user) {
    if (this.status !== GameStatuses.WAITING) {
      throw "cannot leave at current state";
    }
    if (this.userIndex(user) === null) {
      throw "user not in game";
    }
    this.players = _.reject(this.players, (player) => {
      return player.userId === user._id;
    });

// game is considered abandoned when all players left
    if (this.players.length === 0) {
      this.status = GameStatuses.ABANDONED;
    }
  }

/**
   * Handle user action. i.e. putting marker on the game board
   *
   * @param {User} user
   * @param {Number} row Row index of the board
   * @param {Number} col Col index of the board
   */
  userMark(user, row, col) {
    let playerIndex = this.userIndex(user);
    let currentPlayerIndex = this.currentPlayerIndex();
    if (currentPlayerIndex !== playerIndex) {
      throw "user cannot make move at current state";
    }
    if (row < 0 || row >= this.board.length || col < 0 || col >= this.board[row].length) {
      throw "invalid row|col input";
    }
    if (this.board[row][col] !== null) {
      throw "spot is filled";
    }
    this.board[row][col] = playerIndex;

    let winner = this.winner();
    if (winner !== null) {
      this.status = GameStatuses.FINISHED;
    }
    if (this._filledCount() === 9) {
      this.status = GameStatuses.FINISHED;
    }
  }

 /**
   * @return {Number} currentPlayerIndex 0 or 1
   */
  currentPlayerIndex() {
    if (this.status !== GameStatuses.STARTED) {
      return null;
    }

// determine the current player by counting the filled cells
    // if even, then it's first player, otherwise it's second player
    let filledCount = this._filledCount();
    return (filledCount % 2 === 0? 0: 1);
  }

/**
   * Determine the winner of the game
   *
   * @return {Number} playerIndex of the winner (0 or 1). null if not finished
   */
  winner() {
    let board = this.board;
    for (let playerIndex = 0; playerIndex < 2; playerIndex++) {
      // check rows
      for (let r = 0; r < 3; r++) {
        let allMarked = true;
        for (let c = 0; c < 3; c++) {
          if (board[r][c] !== playerIndex) allMarked = false;
        }
        if (allMarked) return playerIndex;
      }

// check cols
      for (let c = 0; c < 3; c++) {
        let allMarked = true;
        for (let r = 0; r < 3; r++) {
          if (board[r][c] !== playerIndex) allMarked = false;
        }
        if (allMarked) return playerIndex;
      }

// check diagonals
      if (board[0][0] === playerIndex && board[1][1] === playerIndex && board[2][2] === playerIndex) {
        return playerIndex;
      }
      if (board[0][2] === playerIndex && board[1][1] === playerIndex && board[2][0] === playerIndex) {
        return playerIndex;
      }
    }
    return null;
  }

/**
   * Helper method to retrieve the player index of a user
   *
   * @param {User} user Meteor.user object
   * @return {Number} index 0-based index, or null if not found
   */
  userIndex(user) {
    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].userId === user._id) {
        return i;
      }
    }
    return null;
  }

  _filledCount() {
    let filledCount = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        if (this.board[r][c] !== null) filledCount++;
      }
    }
    return filledCount;
  }
}
