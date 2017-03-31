import React from 'react';
import Paper from 'material-ui/Paper';
import './Weather.css';

export default (props) => {
    if(!props.weather)
        return <Paper className="weather"/>

    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(props.weather.observationTime);
    
    return (
        <Paper className="weather" >
            {props.weather.summary}({props.weather.weatherCode}), {props.weather.temperature}&deg;C<br/>
            WindSpeed: {props.weather.windSpeed} km/h<br/>        
            PrecipIntensity: {props.weather.precipIntensity}<br/>
            {d.toString()}
        </Paper>);
};