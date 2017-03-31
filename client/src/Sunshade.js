import React, { Component } from 'react';
import Snackbar from 'material-ui/Snackbar';
import Buttons from './Buttons';
import Weather from './Weather';

class Sunshade extends Component {

    constructor() {
        super();
        this.state = {
            auto: true,
            weather: undefined,
            error: undefined
        };

        this.postAuto = this.postAuto.bind(this);
        this.postState = this.postState.bind(this);
    }

    componentDidMount() {
        this.getAuto();
        this.getWeather();
    }

    render() {
        return (
            <div style={{ margin: 12 }}>
                <Weather weather={this.state.weather} />
                <div style={{ height: 12 }} />
                <Buttons auto={this.state.auto} postAuto={this.postAuto} postState={this.postState} />
                <Snackbar
                    open={this.state.error}
                    message={this.state.error}
                    autoHideDuration={10000}
                    onRequestClose={() => this.setState({ error: undefined })}
                />
            </div>
        );
    }

    getAuto() {
        this.props.auth.fetch("/api/auto")
            .then(json => {
                this.setState({ auto: json.state === "on" });
            })
            .catch((e) => {
                this.setState({ error: e.message })
            });
    }

    getWeather() {
        this.props.auth.fetch("/api/weather")
            .then(json => {
                this.setState({ weather: json });
            })
            .catch((e) => {
                this.setState({ error: e.message })
            });
    }

    postAuto(auto) {
        this.props.auth.fetch("/api/auto", {
            method: 'POST',
            body: JSON.stringify({ state: auto ? "on" : "off" })
        })
            .then(() => this.setState({ auto }))
            .catch((e) => {
                this.setState({ error: e.message })
            });
    }

    postState(state) {
        this.props.auth.fetch("/api/control", {
            method: 'POST',
            body: JSON.stringify({ state })
        })
            .catch((e) => {
                this.setState({ error: e.message })
            });
    }

}

export default Sunshade;