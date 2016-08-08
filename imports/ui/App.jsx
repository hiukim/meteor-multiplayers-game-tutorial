import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Games from '../api/collections/games.js';
import GameBoard from './GameBoard.jsx';

class App extends Component {
  render() {
    return (
      <div>
        {this.props.game?
          <GameBoard game={this.props.game}/>
        : null}
      </div>
    )
  }
}

export default createContainer(() => {
  return {
    game: Games.findOne()
  };
}, App);
