const loggerStreams = require("../config/logger.json");
const logger = require("bunyan").createLogger({
    name: "sunshade-control",
    streams: [...loggerStreams, {
        level: "info",
        stream: process.stdout            // log INFO and above to stdout
    }]
});

const server = require("./server")(logger);

const getWeather = require("./getWeatherWunderground")(logger);
const ruleEngine = require("./rule-engine")(server.app, getWeather);

const buttons = (process.arch !== "arm") ? {
    open: () => { logger.info("Open."); },
    close: () => { logger.info("Close."); }
} : require("./gpio-buttons")(logger);

const sunshadeRemote = require("./sunshade-remote")(server.app, buttons);
server.app.emit("control:auto:on");

const scheduler = require("./scheduler")(server.app, undefined, logger);
