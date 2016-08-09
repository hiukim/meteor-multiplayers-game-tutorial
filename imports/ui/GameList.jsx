import React, { Component } from 'react';
import {GamesController} from '../api/controllers/gamesController.js';
import {Game, GameStatuses} from '../api/models/game.js';

export default class GameList extends Component {
  handleNewGame() {
    GamesController.newGame(this.props.user);
  }

handleLeaveGame(gameId) {
    GamesController.userLeaveGame(gameId, this.props.user);
  }

handleJoinGame(gameId) {
    GamesController.userJoinGame(gameId, this.props.user);
  }

handleEnterGame(gameId) {
    this.props.enterGameHandler(gameId);
  }

activeGames() {
    return _.filter(this.props.games, (game) => {
      return game.status === GameStatuses.WAITING || game.status === GameStatuses.STARTED;
    });
  }

myCurrentGameId() {
    let game = _.find(this.activeGames(), (game) => {
      return game.userIndex(this.props.user) !== null;
    });
    return game === undefined? null: game._id;
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
        {this.activeGames().map((game, index) => {
          return (
            <div key={game._id}>
              <span>Game {index+1}</span>
              {this.renderPlayers(game)}

{/* can leave only if user is in the game, and the game is not started */}
              {this.myCurrentGameId() === game._id && game.status === GameStatuses.WAITING? (
                <button onClick={this.handleLeaveGame.bind(this, game._id)}>Leave</button>
              ): null}

{/* can join only if user is not in any game, and the game is not started */}
              {this.myCurrentGameId() === null && game.status === GameStatuses.WAITING? (
                <button onClick={this.handleJoinGame.bind(this, game._id)}>Join</button>
              ): null}

{/* can enter only if the game is started */}
              {game.status === GameStatuses.STARTED? (
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
