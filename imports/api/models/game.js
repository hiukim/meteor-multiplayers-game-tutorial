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

      // random number of piles, and random number objects in each piles
      let numPiles = _.random(3, 5);
      this.board = [];
      for (let i = 0; i < numPiles; i++) {
        this.board.push(_.random(3, 7));
      }
      this.players = [];
      this.currentPlayerIndex = _.random(0, 1); //random starting player
    }
  }

/**
   * Return a list of fields that are required for permanent storage
   *
   * @return {[]String] List of fields required persistent storage
   */
  persistentFields() {
    return ['status', 'board', 'players', 'currentPlayerIndex'];
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
   * User pick
   * @param {User} user
   * @param {Number} pileIndex Index (0 based) of the pile user is picking
   * @param {Number} count Number of objects picked
   */
  userPick(user, pileIndex, count) {
    let playerIndex = this.userIndex(user);
    if (this.currentPlayerIndex !== playerIndex) {
      throw "user cannot make move at current state";
    }
    if (pileIndex < 0 || pileIndex >= this.board.length) {
      throw "invalid pile";
    }
    if (count <= 0 || this.board[pileIndex] < count) {
      throw "invalid count";
    }
    this.board[pileIndex] -= count;
    let winner = this.winner();
    if (winner !== null) {
      this.status = GameStatuses.FINISHED;
    } else {
      this.currentPlayerIndex = 1 - this.currentPlayerIndex;
    }
  }


/**
   * Determine the winner of the game
   *
   * @return {Number} playerIndex of the winner (0 or 1). null if not finished
   */
  winner() {
    let board = this.board;
    let remain = _.reduce(this.board, (memo, count) => {
      return memo + count;
    }, 0);
    if (remain === 0) return this.currentPlayerIndex;
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
}
