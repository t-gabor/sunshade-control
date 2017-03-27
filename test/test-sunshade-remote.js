const sunshadeRemote = require("../server/sunshade-remote");
const events = require("events");

describe("sunshadeRemote", () => {
    let eventEmitter;
    let remote;
    let buttons;

    const state = {
        auto: true
    };

    beforeEach(() => {
        eventEmitter = new events.EventEmitter();
        buttons = {
            open: () => {},
            close: () => {}
        };
        remote = sunshadeRemote(eventEmitter, buttons, state);
    });

    it("should press the open button when open invoked", (done) => {
        buttons.open = () => { done(); };
        buttons.close = () => { done(new Error("close invoked instead.")); };

        remote.open();
    });

    it("should press the close button when close invoked", (done) => {
        buttons.close = () => { done(); };
        buttons.open = () => { done(new Error("open invoked instead.")); };

        remote.close();
    });

    it("should press the open button on control:open when auto mode on.", (done) => {
        eventEmitter.emit("control:auto:on");
        buttons.open = () => { done(); };
        buttons.close = () => { done(new Error("close invoked instead.")); };

        eventEmitter.emit("control:open");
    });

    it("should press the close button on control:close when auto mode on.", (done) => {
        eventEmitter.emit("control:auto:on");
        buttons.close = () => { done(); };
        buttons.open = () => { done(new Error("open invoked instead.")); };

        eventEmitter.emit("control:close");
    });

    it("should not press the open button on control:open when auto mode off.", (done) => {
        eventEmitter.emit("control:auto:off");
        buttons.open = () => { done(new Error("open invoked.")); };
        buttons.close = () => { done(new Error("close invoked.")); };

        eventEmitter.emit("control:open");
        done();
    });

    it("should not press the close button on control:close when auto mode off.", (done) => {
        eventEmitter.emit("control:auto:off");
        buttons.open = () => { done(new Error("open invoked.")); };
        buttons.close = () => { done(new Error("close invoked.")); };

        eventEmitter.emit("control:close");
        done();
    });

    it("should press the open button on control:manual:open when auto mode off.", (done) => {
        eventEmitter.emit("control:auto:off");
        buttons.open = () => { done(); };
        buttons.close = () => { done(new Error("close invoked instead.")); };

        eventEmitter.emit("control:manual:open");
    });

    it("should press the close button on control:manual:close when auto mode off.", (done) => {
        eventEmitter.emit("control:auto:off");
        buttons.close = () => { done(); };
        buttons.open = () => { done(new Error("open invoked instead.")); };

        eventEmitter.emit("control:manual:close");
    });
});
