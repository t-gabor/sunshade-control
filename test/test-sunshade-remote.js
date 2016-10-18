const SunshadeRemote = require("../server/sunshade-remote");
const events = require("events");

describe("SunshadeRemote", () => {
    let eventEmitter;
    let sunshadeRemote;
    let buttons;

    beforeEach(() => {
        eventEmitter = new events.EventEmitter();
        buttons = {
            open: () => {},
            close: () => {}
        };
        sunshadeRemote = new SunshadeRemote(eventEmitter, buttons);
    });

    it("Should press the open button when open invoked", (done) => {
        buttons.open = () => { done(); };
        buttons.close = () => { done(new Error("close invoked instead.")); };

        sunshadeRemote.open();
    });

    it("Should press the close button when close invoked", (done) => {
        buttons.close = () => { done(); };
        buttons.open = () => { done(new Error("open invoked instead.")); };

        sunshadeRemote.close();
    });

    it("Should press the open button on control:open when auto mode on.", (done) => {
        sunshadeRemote.automatic(true);
        buttons.open = () => { done(); };
        buttons.close = () => { done(new Error("close invoked instead.")); };

        eventEmitter.emit("control:open");
    });

    it("Should press the close button on control:close when auto mode on.", (done) => {
        sunshadeRemote.automatic(true);
        buttons.close = () => { done(); };
        buttons.open = () => { done(new Error("open invoked instead.")); };

        eventEmitter.emit("control:close");
    });

    it("Should not press the open button on control:open when auto mode off.", (done) => {
        sunshadeRemote.automatic(false);
        buttons.open = () => { done(new Error("open invoked.")); };
        buttons.close = () => { done(new Error("close invoked.")); };

        eventEmitter.emit("control:open");
        done();
    });

    it("Should not press the close button on control:close when auto mode off.", (done) => {
        sunshadeRemote.automatic(false);
        buttons.open = () => { done(new Error("open invoked.")); };
        buttons.close = () => { done(new Error("close invoked.")); };

        eventEmitter.emit("control:close");
        done();
    });
});
