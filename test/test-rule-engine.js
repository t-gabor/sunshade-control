const ruleEngine = require("../server/rule-engine");
const events = require("events");
const assert = require("assert");

describe("ruleEngine", () => {
    let eventEmitter;
    let weather;

    const getWeather = (cb) => {
        cb(null, weather);
    };

    const state = {
        auto: true,
        rules: undefined
    };

    beforeEach(() => {
        eventEmitter = new events.EventEmitter();
        weather = {
            windSpeed: 0,
            temperature: 20,
            summary: "",
            weatherCode: "clear",
            precipIntensity: 0
        };
        ruleEngine(eventEmitter, getWeather, state);
    });

    it("emits close event if windSpeed is 26", (done) => {
        weather.windSpeed = 26;

        eventEmitter.on("control:close", done);
        eventEmitter.emit("control:update");
    });

    it("emits open event if windSpeed is 14 and weatherCode is clear", (done) => {
        weather.windSpeed = 14;

        eventEmitter.on("control:open", done);
        eventEmitter.emit("control:update");
    });

    it("emits close event if precipIntensity is 1", (done) => {
        weather.precipIntensity = 11;

        eventEmitter.on("control:close", done);
        eventEmitter.emit("control:update");
    });

    it("emits close event if weatherCode is cloudy", (done) => {
        weather.weatherCode = "cloudy";

        eventEmitter.on("control:close", done);
        eventEmitter.emit("control:update");
    });

    it("emits nothing if windSpeed 18", (done) => {
        setTimeout(done, 500);
        weather.windSpeed = 18;

        eventEmitter.on("control:open", () => assert.ok(false, "control:open invoked"));
        eventEmitter.on("control:close", () => assert.ok(false, "control:close invoked"));
        eventEmitter.emit("control:update");
    });
});
