const mock = require("mock-require");
const wuResult = require("./San_Francisco.json");
const assert = require("assert");

let mockedResult;

function mockConstructor() {
    return {
        conditions: () => ({
            hourlyForecast: () => ({
                request: (location, cb) => cb(null, mockedResult)
            })
        })
    };
}

mock("wundergroundnode", mockConstructor);
mock("../config/wunderground.json", {
    key: "x",
    location: "x"
});

const getWeatherWunderground = require("../server/getWeatherWunderground")();

describe("getWeatherWunderground", () => {
    it("returns weather data", (done) => {
        mockedResult = wuResult;
        getWeatherWunderground((error, response) => {
            assert.deepEqual(response, {
                windSpeed: 8,
                temperature: 15.1,
                summary: "Scattered Clouds",
                weatherCode: "mostlycloudy",
                precipIntensity: 0,
                observationTime: 1478256115
            });
            done();
        });
    });

    it("returns max wind speed(wind_kph)", (done) => {
        mockedResult = JSON.parse(JSON.stringify(wuResult));
        mockedResult.current_observation.wind_kph = 10;

        getWeatherWunderground((error, response) => {
            assert.equal(response.windSpeed, 10);
            done();
        });
    });

    it("returns max wind speed(wind_gust_kph)", (done) => {
        mockedResult = JSON.parse(JSON.stringify(wuResult));
        mockedResult.current_observation.wind_gust_kph = 11;

        getWeatherWunderground((error, response) => {
            assert.equal(response.windSpeed, 11);
            done();
        });
    });

    it("returns max wind speed(hourly_forecast[0].wspd.metric)", (done) => {
        mockedResult = JSON.parse(JSON.stringify(wuResult));
        mockedResult.hourly_forecast[0].wspd.metric = 12;

        getWeatherWunderground((error, response) => {
            assert.equal(response.windSpeed, 12);
            done();
        });
    });
});
