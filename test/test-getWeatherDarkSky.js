const fetchMock = require('fetch-mock');
const mock = require("mock-require");
const darkSkyResult = require("./New_York.json");
const assert = require("assert");

let mockedResult;

let mockSettings = {
    apiKey: "xxxxxxxxxxxx",
    "position": {
        "latitude": 42.553487,
        "longitude": 11.804826
    }
}

let mockDarkSky = {
    latitude: (lat) => { assert.equal(lat, mockSettings.position.latitude); return mockDarkSky },
    longitude: (long) => { assert.equal(long, mockSettings.position.longitude); return mockDarkSky },
    units: (u) => { assert.equal(u, "ca"); return mockDarkSky },
    language: (l) => { assert.equal(l, "en"); return mockDarkSky },
    get: () => {
        return Promise.resolve(mockedResult)
    }
};

mock("dark-sky", function (apikey) { assert.equal(apikey, mockSettings.apiKey); return mockDarkSky });
mock("../config/darksky.json", mockSettings);

let localData = {
    wind: 12,
    temp: 26,
    precipIntensity: 3
}

const getWeatherDarkSky = require("../server/getWeatherDarkSky")();

describe("getWeatherDarkSky", () => {

    beforeEach( () => {
        process.env.LOCALWEATHERDATAURL = '';
        fetchMock.restore();
    });

    it("returns weather data", (done) => {
        mockedResult = darkSkyResult;
        getWeatherDarkSky((error, response) => {
            assert.deepEqual(response, {
                windSpeed: 9.56,
                temperature: 50.88,
                summary: "Overcast",
                weatherCode: 'cloudy',
                precipIntensity: 0,
                observationTime: 1555095514,
                nearestStormDistance: 170
            });
            done();
        });
    });

    it("returns weather data merged with local data if LOCALWEATHERDATAURL is defined", (done) => {

        process.env.LOCALWEATHERDATAURL = 'http://example.com:3001';

        fetchMock.mock('http://example.com:3001', localData);

        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.nearestStormDistance = null;
        getWeatherDarkSky((error, response) => {
            assert.deepEqual(response, {
                windSpeed: localData.wind,
                temperature: localData.temp,
                summary: "Overcast",
                weatherCode: 'cloudy',
                precipIntensity: localData.precipIntensity,
                observationTime: 1555095514,
                nearestStormDistance: null
            });
            done();
        });
    });

    it("returns clear weatherCode if icon is clear-day", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.icon = 'clear-day';

        getWeatherDarkSky((error, response) => {
            assert.equal(response.weatherCode, 'clear');
            done();
        });
    });

    it("returns partlycloudy weatherCode if icon is partly-cloudy-day", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.icon = 'partly-cloudy-day';

        getWeatherDarkSky((error, response) => {
            assert.equal(response.weatherCode, 'partlycloudy');
            done();
        });
    });

    it("returns cloudy weatherCode if icon is cloudy", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.icon = 'cloudy';

        getWeatherDarkSky((error, response) => {
            assert.equal(response.weatherCode, 'cloudy');
            done();
        });
    });

    it("returns max wind speed(windSpeed)", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.windSpeed = 10;

        getWeatherDarkSky((error, response) => {
            assert.equal(response.windSpeed, 10);
            done();
        });
    });

    it("returns max wind speed(windGust)", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.windGust = 11;

        getWeatherDarkSky((error, response) => {
            assert.equal(response.windSpeed, 11);
            done();
        });
    });

    it("returns 0 for precipIntensity if there is no storm nearby", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.nearestStormDistance = 170;

        getWeatherDarkSky((error, response) => {
            assert.equal(response.precipIntensity, 0);
            done();
        });
    });

    it("returns 0 for precipIntensity if nearestStormDistance is not defined", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.nearestStormDistance = undefined;

        getWeatherDarkSky((error, response) => {
            assert.equal(response.precipIntensity, 0);
            done();
        });
    });

    it("returns 5 for precipIntensity if there a storm nearby", (done) => {
        mockedResult = JSON.parse(JSON.stringify(darkSkyResult));
        mockedResult.currently.nearestStormDistance = 25;

        getWeatherDarkSky((error, response) => {
            assert.equal(response.precipIntensity, 5);
            done();
        });
    });
});