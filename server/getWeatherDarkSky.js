const DarkSky = require('dark-sky');
const settings = require("../config/darksky.json");

const darkSky = new DarkSky(settings.apiKey);

var iconCodeMap = new Map([['clear-day', 'clear'], ['partly-cloudy-day', 'partlycloudy']]);

function extractWeatherData(data) {
    const co = data.currently;
    return {
        windSpeed: Math.max(co.windSpeed, co.windGust),
        temperature: co.temperature,
        summary: co.summary,
        weatherCode: iconCodeMap.get(co.icon),
        precipIntensity: co.precipIntensity + co.precipProbability + (co.nearestStormDistance == null || co.nearestStormDistance > 25) ? 0 : 5,
        observationTime: co.time
    };
}

module.exports = logger => (cb) => {
    darkSky.latitude(settings.position.latitude)
        .longitude(settings.position.longitude)
        .units('si')
        .language('en')
        .get()
        .then(response => {
            const data = extractWeatherData(response);
            if (logger) {
                logger.info(data);
            }

            cb(null, data);
        })
        .catch (err => { cb(err) });
};