import { Mongo } from 'meteor/mongo';
import { Game } from '../models/game.js';

export default Games = new Mongo.Collection('games', {
  transform(doc) {
    return new Game(doc);
  }
});

_.extend(Games, {
  saveGame(game) {

    let gameDoc = {};
    _.each(game.persistentFields(), (field) => {
      gameDoc[field] = game[field];
    });

    if (game._id) {
      Games.update(game._id, {
        $set: gameDoc
      });
    } else {
      Games.insert(gameDoc);
    }
  }
});
