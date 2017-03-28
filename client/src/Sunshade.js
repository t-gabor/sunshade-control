import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Toggle from 'material-ui/Toggle';
import Snackbar from 'material-ui/Snackbar';

class Sunshade extends Component {

    constructor() {
        super();
        this.state = {
            auto: true,
            error: undefined
        };

        this.postAuto = this.postAuto.bind(this);
        this.postState = this.postState.bind(this);
    }

    render() {
        return (
            <div style={{ width: 250 }}>
                <div style={{ margin: 12 }}>
                    <Toggle label="Auto" toggled={this.state.auto} onToggle={(event, checked) => this.postAuto(checked)} />
                </div>
                <RaisedButton disabled={this.state.auto} label="Open" primary={true} style={{ margin: 12 }} onTouchTap={(event) => this.postState("open")} />
                <RaisedButton disabled={this.state.auto} label="Close" secondary={true} style={{ margin: 12, float: "right" }} onTouchTap={(event) => this.postState("close")}/>
                <Snackbar
                    open={this.state.error}
                    message={this.state.error}
                    autoHideDuration={10000}
                    onRequestClose={() => this.setState({ error: undefined })}
                />
            </div>
        );
    }

    postAuto(auto) {
        fetch("/api/auto", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ state: auto ? "on" : "off" })
        })
            .then(() => this.setState({ auto }))
            .catch((e) => {
                this.setState({ error: e.message })
            });
    }

    postState(state) {
        fetch("/api/control", {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ state })
        })
            .catch((e) => {
                this.setState({ error: e.message })
            });
    }

}

export default Sunshade;