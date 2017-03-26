import React from 'react';
import AppBar from 'material-ui/AppBar';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

const Sunshade = () => (
    <div>
        <AppBar
            title="Sunshade Control"
        />
        <RaisedButton label="Open" primary={true} style={style} />
        <RaisedButton label="Close" secondary={true} style={style} />
    </div>
);

export default Sunshade;