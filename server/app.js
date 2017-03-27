const EventEmitter = require('events');

const loggerStreams = require("../config/logger.json");
const logger = require("bunyan").createLogger({
    name: "sunshade-control",
    streams: [...loggerStreams, {
        level: "info",
        stream: process.stdout            // log INFO and above to stdout
    }]
});

const buttons = (process.arch !== "arm") ? {
    open: () => { logger.info("Open."); },
    close: () => { logger.info("Close."); }
} : require("./gpio-buttons")(logger);

const state = {
    auto: true,
    rules: undefined
};

const emitter = new EventEmitter();

const getWeather = require("./getWeatherWunderground")(logger);
require("./rule-engine")(emitter, getWeather, state);
require("./sunshade-remote")(emitter, buttons, state);
require("./scheduler")(emitter, state, logger);
require("./server")(emitter, state, logger);
