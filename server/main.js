import { Meteor } from 'meteor/meteor';
import Games from '../imports/api/collections/games.js'; // import Games collection

Meteor.startup(() => {
  // code to run on server at startup

  Games.remove({});  // remove all existing game documents

  let gameDoc = {
    board: [[null, null, null], [null, null, null], [null, null, null]]
  };

  Games.insert(gameDoc); // insert a new game document into the collection
});
