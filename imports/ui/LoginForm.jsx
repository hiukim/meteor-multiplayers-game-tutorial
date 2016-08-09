import { Random } from 'meteor/random'
import React, { Component } from 'react';

export default class LoginForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
    }
  }

  handleUsernameChange(e) {
    this.setState({username: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();

  let username = this.state.username.trim();
    if (username === '') return;
    Accounts.createUser({
      username: username,
      password: Random.secret()
    });
  }

  render() {
    return (
      <form name="login-form" onSubmit={this.handleSubmit.bind(this)}>
        <h1>Login</h1>
        <input type="text" onChange={this.handleUsernameChange.bind(this)} placeholder="Enter your name"/>
        <input type="submit" value="Login"/>
      </form>
    )
  }
}
