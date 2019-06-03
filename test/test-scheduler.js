const scheduler = require("../server/scheduler");
const events = require("events");
const lolex = require("lolex");
const assert = require("assert");

describe("scheduler", () => {
    const options = {
        fromHour: 10,
        toHour: 16,
        inteval: 10
    };

    let eventEmitter;
    let schedulerHandle;
    let clock;

    beforeEach(() => {
        // One hour before options.fromHour
        clock = lolex.install(global, new Date(2016, 5, 1, 9, 0, 0, 0));
        eventEmitter = new events.EventEmitter();
        schedulerHandle = scheduler(eventEmitter, options);
    });

    afterEach(() => {
        schedulerHandle.cancel();
        clock.uninstall();
    });

    it("emits control:update at the specified intevals", () => {
        let counter = 0;
        eventEmitter.on("control:update", () => {
            counter += 1;
        });

        clock.tick("01:59:00");
        assert.equal(counter, 6);
    });

    it("emits control:close at end of day", (done) => {
        clock.tick("06:59:00");
        eventEmitter.on("control:manual:close", () => {
            done();
        });
        clock.tick("00:01:00");
    });

    it("no update event before fromHour", () => {
        let counter = 0;
        eventEmitter.on("control:update", () => {
            counter += 1;
        });

        clock.tick("00:59:00");
        assert.equal(counter, 0);
    });

    it("no update event after toHour", () => {
        clock.tick("06:59:00");
        let counter = 0;
        eventEmitter.on("control:update", () => {
            counter += 1;
        });

        clock.tick("01:00:00");
        assert.equal(counter, 0);
    });
});
