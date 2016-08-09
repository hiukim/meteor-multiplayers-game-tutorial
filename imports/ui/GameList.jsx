import React, { Component } from 'react';
import GameHeader from './GameHeader.jsx';
import {Game, GameStatuses} from '../api/models/game.js';
import {newGame, userJoinGame, userLeaveGame} from '../api/methods/games.js';

export default class GameList extends Component {
  handleNewGame() {
    newGame.call({});
  }

  handleLeaveGame(gameId) {
    userLeaveGame.call({gameId: gameId});
  }

  handleJoinGame(gameId) {
    userJoinGame.call({gameId: gameId});
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
    let player1 = game.players.length > 0? game.players[0].username: '(waiting)';
    let player2 = game.players.length > 1? game.players[1].username: '(waiting)';
    return (
      <div>
        <div>
          <i className="user icon"></i> {player1}
        </div>
        <div>
          <i className="user icon"></i> {player2}
        </div>
      </div>
    )
  }

  render() {
    return (
    <div className="ui container">
      <GameHeader user={this.props.user}/>

      <h1 className="ui top attached header">List of games</h1>
      <div className="ui attached segment">
        <div className="ui three cards">
          {this.activeGames().map((game, index) => {
            return (
              <div key={game._id} className="ui card">
                <div className="content">
                  <div className="header">
                    {game.status === GameStatuses.WAITING? (
                      <span className="ui right yellow corner label">
                        <i className="idea icon"/>
                      </span>
                    ): null}
                    Game {index+1}
                  </div>
                </div>
                <div className="content">
                  {this.renderPlayers(game)}
                </div>

                <div className="extra content">
                  {/* can leave only if user is in the game, and the game is not started */}
                  {this.myCurrentGameId() === game._id && game.status === GameStatuses.WAITING? (
                    <button className="ui red button" onClick={this.handleLeaveGame.bind(this, game._id)}>Leave</button>
                  ): null}

                  {/* can join only if user is not in any game, and the game is not started */}
                  {this.myCurrentGameId() === null && game.status === GameStatuses.WAITING? (
                    <button className="ui green button" onClick={this.handleJoinGame.bind(this, game._id)}>Join</button>
                  ): null}

                  {/* can enter only if the game is started */}
                  {game.status === GameStatuses.STARTED? (
                    <button className="ui blue button" onClick={this.handleEnterGame.bind(this, game._id)}>Enter</button>
                  ): null}

                  {/* just a invisible dummy button to make up the space */}
                  <button className="ui button" style={{visibility: "hidden"}}>Dummy</button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Only show new game button if player is not in any room */}
      </div>
      <div className="ui attached segment">
        {this.myCurrentGameId() === null? (
          <div>
            <button className="ui green button" onClick={this.handleNewGame.bind(this)}>New Game</button>
          </div>
        ): null}
      </div>
    </div>
    )
  }
}
