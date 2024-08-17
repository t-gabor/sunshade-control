const EventEmitter = require('events');
const jsonfile = require('jsonfile');

const logger = require("bunyan").createLogger({
    name: "sunshade-control",
    streams: [{
        level: "info",
        stream: process.stdout            // log INFO and above to stdout
    }]
});

const buttons = (process.arch !== "arm") ? {
    open: () => { logger.info("Open."); },
    close: () => { logger.info("Close."); }
} : require("./gpio-buttons")(logger);

const stateFile = process.env.SUNSHADE_AUTO_CONFIG

const state = {
    auto: true,
    rules: undefined,
    save: function () {
        const obj = { auto: this.auto };
        jsonfile.writeFile(stateFile, obj, (err) => { if (err) logger.error(err) });
    }
}

jsonfile.readFile(stateFile, (err, obj) => {
    if (err) {
        logger.info(err);
    } else {
        logger.info("Restored auto :" + obj.auto);
        state.auto = obj.auto;
    }
})

const emitter = new EventEmitter();

const getWeather = require("./getWeather")(logger);
require("./rule-engine")(emitter, getWeather, state, logger);
require("./sunshade-remote")(emitter, buttons, state, logger);
require("./scheduler")(emitter, undefined, logger);
require("./server")(emitter, state, logger);