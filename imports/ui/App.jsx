import React, { Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import Games from '../api/collections/games.js';
import GameList from './GameList.jsx';
import GameBoard from './GameBoard.jsx';
import LoginForm from './LoginForm.jsx';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedGameId: null,
    }
  }

handleEnterGame(gameId) {
    this.setState({selectedGameId: gameId});
  }

handleBackToGameList() {
    this.setState({selectedGameId: null});
  }

selectedGame() {
    let selectedGame = _.find(this.props.games, (game) => {
      return game._id === this.state.selectedGameId;
    });
    return selectedGame;
  }

render() {
    if (!this.props.user) {
      return (
        <div>
          <LoginForm/>
        </div>
      )
    }

if (this.state.selectedGameId === null) {
      return (
        <GameList
          games={this.props.games}
          enterGameHandler={this.handleEnterGame.bind(this)}
          user={this.props.user}/>
      )
    } else {
      return (
        <GameBoard
          game={this.selectedGame()}
          backToGameListHandler={this.handleBackToGameList.bind(this)}
          user={this.props.user}/>
      )
    }
  }
}

export default createContainer(() => {
  return {
    user: Meteor.user(),
    games: Games.find().fetch()
  };
}, App);
