import React, { Component } from 'react';
import Games from '../api/collections/games.js';

export default class GameList extends Component {
  handleNewGame() {
    Games.newGame(this.props.user);
  }

handleLeaveGame(gameId) {
    Games.leaveGame(gameId, this.props.user);
  }

handleJoinGame(gameId) {
    Games.joinGame(gameId, this.props.user);
  }

handleEnterGame(gameId) {
    this.props.enterGameHandler(gameId);
  }

myCurrentGameId() {
    // find game where the user is currently in
    let game = _.find(this.props.games, (game) => {
      return _.find(game.players, (player) => {
        return player.userId === this.props.user._id;
      }) !== undefined;
    });
    if (game === undefined) return null;
    return game._id;
  }

renderPlayers(game) {
    let player1 = game.players.length > 0? game.players[0].username: '';
    let player2 = game.players.length > 1? game.players[1].username: '';
    return (
      <span>[{player1}] vs [{player2}]</span>
    )
  }

render() {
    return (
    <div>
      <div>
        <h1>List of games</h1>
        {this.props.games.map((game, index) => {
          return (
            <div key={game._id}>
              <span>Game {index+1}</span>
              {this.renderPlayers(game)}

{/* can leave only if user is in the game, and the game is not started */}
              {this.myCurrentGameId() === game._id && game.players.length < 2? (
                <button onClick={this.handleLeaveGame.bind(this, game._id)}>Leave</button>
              ): null}

{/* can join only if user is not in any game, and the game is not started */}
              {this.myCurrentGameId() === null && game.players.length < 2? (
                <button onClick={this.handleJoinGame.bind(this, game._id)}>Join</button>
              ): null}

{/* can enter only if the game is started */}
              {game.players.length === 2? (
                <button onClick={this.handleEnterGame.bind(this, game._id)}>Enter</button>
              ): null}
            </div>
          )
        })}
      </div>

{/* Only show new game button if player is not in any room */}
      {this.myCurrentGameId() === null? (
        <div>
          <button onClick={this.handleNewGame.bind(this)}>New Game</button>
        </div>
      ): null}
    </div>
    )
  }
}
