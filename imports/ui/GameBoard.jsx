import React, { Component } from 'react';
import {GamesController} from '../api/controllers/gamesController.js';
import {Game, GameStatuses} from '../api/models/game.js';
import {userMarkGame} from '../api/methods/games.js';

export default class GameBoard extends Component {
  handleCellClick(row, col) {
    let game = this.props.game;
    if (game.currentPlayerIndex() !== game.userIndex(this.props.user)) return;
    userMarkGame.call({gameId: game._id, row: row, col: col});
  }

handleBackToGameList() {
    this.props.backToGameListHandler();
  }

renderCell(row, col) {
    let value = this.props.game.board[row][col];
    if (value === 0) return (<td>O</td>);
    if (value === 1) return (<td>X</td>);
    if (value === null) return (
      <td onClick={this.handleCellClick.bind(this, row, col)}></td>
    );
  }

renderStatus() {
    let game = this.props.game;
    let status = "";
    if (game.status === GameStatuses.STARTED) {
      let playerIndex = game.currentPlayerIndex();
      status = `In Progress: current player: ${game.players[playerIndex].username}`;
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
      <div>
        <button onClick={this.handleBackToGameList.bind(this)}>Back</button>
        {this.renderStatus()}
        <table className="game-board">
          <tbody>
            <tr>
              {this.renderCell(0, 0)}
              {this.renderCell(0, 1)}
              {this.renderCell(0, 2)}
            </tr>
            <tr>
              {this.renderCell(1, 0)}
              {this.renderCell(1, 1)}
              {this.renderCell(1, 2)}
            </tr>
            <tr>
              {this.renderCell(2, 0)}
              {this.renderCell(2, 1)}
              {this.renderCell(2, 2)}
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}
