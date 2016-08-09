import React, { Component } from 'react';

export default class GameBoard extends Component {
  handleLogout() {
    Meteor.logout();
  }
  render() {
    return (
      <div className="ui menu inverted">
        <div className="header item">
          Online Tic-Tac-Toe
        </div>

        {this.props.user? (
          <div className="right menu">
            <div className="item">
              <i className="meh icon"/>
              {this.props.user.username}
            </div>
            <a className="item" onClick={this.handleLogout.bind(this)}>
              Logout
            </a>
          </div>
        ): null}
      </div>
    )
  }
}
