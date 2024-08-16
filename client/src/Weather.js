import { Card } from 'primereact/card'

export default function Weather(props) {

    const weather = props.weather

    if (!weather || Object.keys(weather).length === 0) {
        return ( <Card>Error getting weather</Card> )
    }

    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch    
    d.setUTCSeconds(weather.observationTime)
    
    return (
        <Card>
                {weather.summary}({weather.weatherCode}), {weather.temperature}&deg;C<br />
                WindSpeed: {weather.windSpeed} km/h<br />
                PrecipIntensity: {weather.precipIntensity}<br />
                {d.toString()}
        </Card>
    )
}