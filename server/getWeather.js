const fetch = require('node-fetch');

var iconCodeMap = new Map([['Sunny', 'clear'], ['Clear', 'clear'], ['Fair', 'clear'], ['P Cloudy', 'partlycloudy'], ['M Cloudy', 'partlycloudy'], ['Cloudy', 'cloudy']]);

const url = `https://api.weather.com/v3/wx/observations/current?apiKey=${process.env.WEATHER_API_KEY}&geocode=${process.env.WEATHER_GEOCODE}&language=en-US&units=m&format=json`;

module.exports = logger => (cb) => {
    fetch(url)
        .then(res => res.json())
        .then(body => {
            const data = {
                windSpeed : body.windSpeed,
                temperature : body.temperature,
                windGust : body.windGust || body.windSpeed,
                precipIntensity : body.precip1Hour,
                weatherCode : iconCodeMap.get(body.wxPhraseShort),
                summary : body.wxPhraseShort,
                observationTime : body.validTimeUtc
            }
            if (logger) {
                logger.info(data);
            }
            cb(null, data);
        })
        .catch(err => { cb(err) });
};