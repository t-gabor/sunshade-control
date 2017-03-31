import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import AppBarButton from './AppBarButton';
import Sunshade from './Sunshade';
import AuthService from './AuthService';
import auth0 from '../../config/auth0.json';

import './App.css';

injectTapEventPlugin();

class App extends Component {

  constructor(props) {
    super(props);

    this.auth = new AuthService(auth0.clientId, auth0.domain, () => this.forceUpdate());
  }

  render() {
    return (
      <MuiThemeProvider>
        <div>
          <AppBar title="Sunshade Control"
            iconElementRight={this.auth.loggedIn() ?
              <AppBarButton label="Logout" onTouchTap={() => this.auth.logout()} /> :
              <AppBarButton label="Login" onTouchTap={() => this.auth.login()} />} />
          {this.auth.loggedIn() ? <Sunshade auth={this.auth} /> : <div className="login-please">Please log in.</div>}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
