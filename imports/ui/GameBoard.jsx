import React, { Component } from 'react';
import GameHeader from './GameHeader.jsx';
import {Game, GameStatuses} from '../api/models/game.js';
import {userPickGame} from '../api/methods/games.js';

export default class GameBoard extends Component {
  constructor(props) {
    super(props);
    let pickCounts = [];
    for (let i = 0; i < props.game.board.length; i++) {
      pickCounts.push(0);
    }
    this.state = {
      pickCounts: pickCounts,
    }
  }

  handleBackToGameList() {
    this.props.backToGameListHandler();
  }

  handlePickCountsChange(pileIndex, e) {
    let newPickCounts = [];
    for (let i = 0; i < this.state.pickCounts.length; i++) {
      newPickCounts.push(this.state.pickCounts[i]);
    }
    newPickCounts[pileIndex] = e.target.value;
    this.setState({pickCounts: newPickCounts});
  }

  handlePick(pileIndex) {
    userPickGame.call({gameId: this.props.game._id, pileIndex: pileIndex, count: parseInt(this.state.pickCounts[pileIndex])});
  }

  renderStatus() {
    let game = this.props.game;
    let status = "";
    if (game.status === GameStatuses.STARTED) {
      let playerIndex = game.currentPlayerIndex;
      status = `Current player: ${game.players[playerIndex].username}`;
    } else if (game.status === GameStatuses.FINISHED) {
      let playerIndex = game.winner();
      if (playerIndex === null) {
        status = "Finished: tie";
      } else {
        status = `Finished: winner: ${game.players[playerIndex].username}`;
      }
    }

    return (
      <div>{status}</div>
    )
  }

  render() {
    return (
      <div className="ui container">
        <GameHeader user={this.props.user}/>

        <button className="ui button blue" onClick={this.handleBackToGameList.bind(this)}>Back to Lobby</button>

        <div className="ui top attached header">
          <div className="ui grid">
            <div className="ui three column center aligned row">
              <div className="ui column">
                {this.props.game.players[0].username}
              </div>
              <div className="ui column">
                v.s.
              </div>
              <div className="ui column">
                {this.props.game.players[1].username}
              </div>
            </div>
          </div>
        </div>
        <div className="ui attached center aligned segment">
          {this.renderStatus()}
        </div>

        <div className="ui attached segment">
          <div className="game-board">
            {this.props.game.board.map((pileCount, pileIndex) => {
              return (
                <div key={pileIndex}>
                  {_.range(pileCount).map((index) => {
                    return (
                      <span key={index} className="object">&nbsp;</span>
                      )
                  })}

                  {/* only in player turn and remains > 0 */}
                  {pileCount > 0 && this.props.game.currentPlayerIndex === this.props.game.userIndex(this.props.user)? (
                    <span>
                      <input size="2" type="text" onChange={this.handlePickCountsChange.bind(this, pileIndex)} value={this.state.pickCounts[pileIndex]}/> <button className="ui button" onClick={this.handlePick.bind(this, pileIndex)}>Pick</button>
                    </span>
                  ): null}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }
}
