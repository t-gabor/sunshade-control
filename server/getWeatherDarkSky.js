const DarkSky = require('dark-sky');
const settings = require('../config/darksky.json');
const fetch = require('node-fetch');

const darkSky = new DarkSky(settings.apiKey);

var iconCodeMap = new Map([['clear-day', 'clear'], ['partly-cloudy-day', 'partlycloudy'], ['fog', 'partlycloudy'], ['cloudy', 'cloudy']]);

function extractWeatherData(data) {
    const co = data.currently;
    return {
        windSpeed: Math.max(co.windSpeed, co.windGust),
        temperature: co.temperature,
        summary: co.summary,
        weatherCode: iconCodeMap.get(co.icon),
        precipIntensity: co.nearestStormDistance == null || co.nearestStormDistance > 25 ? 0 : 5,
        nearestStormDistance: co.nearestStormDistance,
        observationTime: co.time
    };
}

module.exports = logger => (cb) => {
    darkSky.latitude(settings.position.latitude)
        .longitude(settings.position.longitude)
        .units('ca')
        .language('en')
        .get()
        .then(response => {
            const data = extractWeatherData(response);
            const localDataUrl = process.env.LOCALWEATHERDATAURL;
            if (localDataUrl) {
                return fetch(localDataUrl)
                    .then(response => response.json())
                    .then(localData => {
                        data.windSpeed = localData.wind;
                        data.temperature = localData.temp;
                        if(!data.nearestStormDistance || data.nearestStormDistance > 30) {
                            data.precipIntensity = localData.precipIntensity;
                        }

                        if (logger) {
                            logger.info(data);
                        }

                        return data;
                    })
                    .catch(err => cb(err))
            }

            if (logger) {
                logger.info(data);
            }

            return data;
        })
        .then(data => cb(null, data))
        .catch(err => { cb(err) });
};