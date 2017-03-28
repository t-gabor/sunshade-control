import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Sunshade from './Sunshade'
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const App = () => (
  <MuiThemeProvider>
    <Sunshade/>
  </MuiThemeProvider>
);

export default App;
