const request = require("supertest");
const EventEmitter = require('events');

const emitter = new EventEmitter();

const state = {
    auto: true
};

const logger = {
    info: () => { },
    error: () => { }
};

const server = require("../server/server")(emitter, state, logger);

describe("#/api/control", () => {
    after(() => {
        server.server.close();
    });

    it("should respond 404 to GET", (done) => {
        request(server.app)
            .get("/api/control")
            .expect(404, done);
    });

    it("should respond 400 to marlformed request", (done) => {
        request(server.app)
            .post("/api/control")
            .set("Content-Type", "application/json")
            .send("a=1")
            .expect(400, done);
    });

    function postState(value) {
        return request(server.app)
            .post("/api/control")
            .set("Content-Type", "application/json")
            .send(`{"state": "${value}"}`);
    }

    it("should respond 200 to open request", (done) => {
        postState("open")
            .expect(200, done);
    });

    it("should respond 200 to close request", (done) => {
        postState("close")
            .expect(200, done);
    });

    it("should raise control:manual:open event", (done) => {
        emitter.once("control:manual:open", () => {
            done();
        });
        postState("open").end();
    });

    it("should raise control:manual:close event", (done) => {
        emitter.once("control:manual:close", () => {
            done();
        });
        postState("close").end();
    });
});

describe("#/api/auto", () => {
    after(() => {
        server.server.close();
    });

    it("should respond 400 to marlformed request", (done) => {
        request(server.app)
            .post("/api/auto")
            .set("Content-Type", "application/json")
            .send("a=1")
            .expect(400, done);
    });

    function postState(value) {
        return request(server.app)
            .post("/api/auto")
            .set("Content-Type", "application/json")
            .send(`{"state": "${value}"}`);
    }

    it("should respond 200 to on request", (done) => {
        postState("on")
            .expect(200, done);
    });

    it("should respond 200 to off request", (done) => {
        postState("off")
            .expect(200, done);
    });

    it("should raise control:auto:on event", (done) => {
        emitter.once("control:auto:on", () => {
            done();
        });
        postState("on").end();
    });

    it("should raise control:auto:off event", (done) => {
        emitter.once("control:auto:off", () => {
            done();
        });
        postState("off").end();
    });

    it("should respond on to GET if auto mode on.", (done) => {
        state.auto = true;
        request(server.app)
            .get("/api/auto")
            .expect({ state: "on" }, done);
    });

    it("should respond off to GET if auto mode off.", (done) => {
        state.auto = false;
        request(server.app)
            .get("/api/auto")
            .expect({ state: "off" }, done);
    });
});

describe("#/api/weather", () => {
    after(() => {
        server.server.close();
    });

    it("should respond with the weather object to get", (done) => {
        state.weather = {
            code: "clear",
            temp: 15
        };

        request(server.app)
            .get("/api/weather")
            .expect(state.weather, done);
    });

    it("should respond with empty string if the weather object is undefined", (done) => {
        state.weather = undefined;

        request(server.app)
            .get("/api/weather")
            .expect("", done);
    });
});
