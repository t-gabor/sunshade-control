import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import './Buttons.css';

export default (props) => (
    <div>
        <div className="button-group" >
            <Toggle label="Auto" labelPosition="right" toggled={props.auto} onToggle={(event, checked) => props.postAuto(checked)} />
        </div>
        <div className="button-group" >
            <RaisedButton className="open" disabled={props.auto} label="Close" secondary={true} onTouchTap={(event) => props.postState("close")} />
            <RaisedButton className="close" disabled={props.auto} label="Open" primary={true} onTouchTap={(event) => props.postState("open")} />            
        </div>
    </div>
);