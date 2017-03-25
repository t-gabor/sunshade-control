const loggerStreams = require("../config/logger.json");
const logger = require("bunyan").createLogger({
    name: "sunshade-control",
    streams: loggerStreams
});

const server = require("./server")(logger);

const getWeather = require("./getWeatherWunderground")(logger);
const ruleEngine = require("./ruleEngine")(server.app, getWeather);

const buttons = {
    open: () => { logger.info("Open."); },
    close: () => { logger.info("Close."); }
};

const sunshadeRemote = require("./sunshade-remote")(server.app, buttons);
sunshadeRemote.automatic(true);

const scheduler = require("./scheduler")(server.app, undefined, logger);
