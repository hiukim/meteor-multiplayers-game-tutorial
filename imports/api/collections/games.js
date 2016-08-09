import { Mongo } from 'meteor/mongo';

export default Games = new Mongo.Collection('games');

_.extend(Games, {
  newGame() {
    let gameDoc = {
      board: [[null, null, null], [null, null, null], [null, null, null]],
      players: []
    };
    let gameId = Games.insert(gameDoc); // insert a new game document into the collection
    return gameId;
  },

  joinGame(gameId, user) {
    console.log("gameId; ", gameId, user);
    let game = Games.findOne(gameId);
    if (game.players.length === 2) {
      throw "game is full";
    }
    game.players.push({
      userId: user._id,
      username: user.username
    });
    Games.update(game._id, {
      $set: {players: game.players}
    });
  },

  leaveGame(gameId, user) {
    let game = Games.findOne(gameId);
    game.players = _.reject(game.players, (player) => {
      return player.userId === user._id;
    });
    Games.update(game._id, {
      $set: {players: game.players}
    });
  }
});
