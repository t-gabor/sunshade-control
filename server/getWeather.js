const fetch = require('node-fetch');

var iconCodeMap = new Map([['Sunny', 'clear'], ['Clear', 'clear'], ['Fair', 'clear'], ['P Cloudy', 'partlycloudy'], ['M Cloudy', 'partlycloudy'], ['Cloudy', 'cloudy']]);

module.exports = logger => (cb) => {
    const localDataUrl = process.env.LOCALWEATHERDATAURL;
    if (!localDataUrl) {
        cb("Missing LOCALWEATHERDATAURL env");
        return;
    }
    
    fetch(localDataUrl)
        .then(res => res.json())
        .then(localData => {
            const data = {
                windSpeed : localData.wind,
                temperature : localData.temp,
                windGust : localData.windGust,
                precipIntensity : localData.precipIntensity,
                weatherCode : iconCodeMap.get(localData.code),
                summary : localData.code,
                observationTime : localData.time
            }
            if (logger) {
                logger.info(data);
            }
            cb(null, data);
        })
        .catch(err => { cb(err) });
};