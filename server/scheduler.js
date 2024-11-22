const schedule = require("node-schedule");

// Dummy interval timer to keep this thread awake
// See https://github.com/nodejs/node/issues/4262 
setInterval(() => {}, 60000);

const defaultOptions = {
    fromHour: 10,
    toHour: 18,
    interval: 5
};

function scheduler(eventEmitter, options = defaultOptions, logger) {
    const udpateRule = new schedule.RecurrenceRule();
    udpateRule.hour = new schedule.Range(options.fromHour, options.toHour - 1);
    udpateRule.minute = new schedule.Range(0, 59, options.interval || 15);
    const updateJob = schedule.scheduleJob(udpateRule, () => {
        if (logger) {
            logger.info("Update.");
        }
        eventEmitter.emit("control:update");
    });

    const endOfDayRule = new schedule.RecurrenceRule();
    endOfDayRule.hour = options.toHour;
    endOfDayRule.minute = new schedule.Range(5, 15, 5);
    const endOfDayJob = schedule.scheduleJob(endOfDayRule, () => {
        if (logger) {
            logger.info("End of Day, closing.");
        }
        eventEmitter.emit("control:manual:close");
    });

    return {
        cancel: () => {
            updateJob.cancel();
            endOfDayJob.cancel();
        }
    };
}

module.exports = scheduler;
