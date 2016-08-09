import {Game} from "../models/game.js";
import Games from "../collections/games.js";

export let GamesController = {
  newGame(user) {
    let game = new Game();
    game.userJoin(user);
    Games.saveGame(game);
  },

  userJoinGame(gameId, user) {
    let game = Games.findOne(gameId);
    game.userJoin(user);
    Games.saveGame(game);
  },

  userLeaveGame(gameId, user) {
    let game = Games.findOne(gameId);
    game.userLeave(user);
    Games.saveGame(game);
  },

  userMarkGame(gameId, user, row, col) {
    let game = Games.findOne(gameId);
    game.userMark(user, row, col);
    Games.saveGame(game);
  }
}
