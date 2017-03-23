const Wunderground = require("wundergroundnode");
const settings = require("../config/wunderground.json");

const wunderground = new Wunderground(settings.key);

function extractWeatherData(data) {
    const co = data.current_observation;
    return {
        windSpeed: Math.max(co.wind_kph, co.wind_gust_kph, data.hourly_forecast[0].wspd.metric),
        temperature: co.temp_c,
        summary: co.weather,
        weatherCode: data.hourly_forecast[0].icon,
        precipIntensity: co.precip_1hr_metric,
        observationTime: co.observation_epoch
    };
}

module.exports = logger => (cb) => {
    wunderground.conditions().hourlyForecast().request(settings.location, (error, response) => {
        if (error) {
            cb(error);
        } else {
            const data = extractWeatherData(response);
            if (logger) {
                logger.info(data);
            }

            cb(null, data);
        }
    });
};
