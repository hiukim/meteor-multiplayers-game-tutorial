import React, { Component } from 'react';
import Games from '../api/collections/games.js';

export default class GameList extends Component {
  handleNewGame() {
    let gameDoc = {
      board: [[null, null, null], [null, null, null], [null, null, null]]
    };
    Games.insert(gameDoc); // insert a new game document into the collection
  }

handleEnterGame(gameId) {
    this.props.enterGameHandler(gameId);
  }

render() {
    return (
    <div>
      <div>
        <button onClick={this.handleNewGame.bind(this)}>New Game</button>
      </div>

<div>
        <h1>List of games</h1>
        {this.props.games.map((game, index) => {
          return (
            <div key={game._id}>
              <span>Game {index+1}</span>
              <button onClick={this.handleEnterGame.bind(this, game._id)}>Enter</button>
            </div>
          )
        })}
      </div>
    </div>
    )
  }
}
