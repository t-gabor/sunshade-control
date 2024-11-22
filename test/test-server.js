const request = require("supertest");
const EventEmitter = require('events');
const jwt = require('jsonwebtoken');

const emitter = new EventEmitter();

const state = {
    auto: true
};

const logger = {
    info: () => { },
    error: () => { }
};

const token = jwt.sign({ foo: 'bar' }, process.env.SUPABASE_JWT_SECRET, { algorithm: 'HS256' });
const server = require("../server/server")(emitter, state, logger);

describe("#/api/control", () => {

    after(() => {
        server.server.close();
    });

    it("should respond 404 to GET", (done) => {
        request(server.app)
            .get("/api/control")
            .set('Authorization', `Bearer ${token}`)
            .expect(404, done);
    });

    it("should respond 400 to marlformed request", (done) => {
        request(server.app)
            .post("/api/control")
            .send("a=1")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${token}`)
            .expect(400, done);
    });

    function postState(value) {
        return request(server.app)
            .post("/api/control")
            .set("Content-Type", "application/json")
            .set('Authorization', `Bearer ${token}`)
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
        var error = "no event emitted"
        emitter.once("control:manual:open", () => {
            error = undefined
        });
        postState("open").end(() => done(error));
    });

    it("should raise control:manual:close event", (done) => {
        var error = "no event emitted"
        emitter.once("control:manual:close", () => {
            error = undefined
        });
        postState("close").end(() => done(error));
    });

    it("should respond 200 to update request", (done) => {
        postState("update")
            .expect(200, done);
    });

    it("should raise control:update event", (done) => {
        var error = "no event emitted"
        emitter.once("control:update", () => {
            error = undefined
        });
        postState("update").end(() => done(error));
    });
});

describe("#/api/auto", () => {
    after(() => {
        server.server.close();
    });

    it("should respond 400 to marlformed request", (done) => {
        request(server.app)
            .post("/api/auto")
            .set('Authorization', `Bearer ${token}`)
            .set("Content-Type", "application/json")
            .send("a=1")
            .expect(400, done);
    });

    function postState(value) {
        return request(server.app)
            .post("/api/auto")
            .set('Authorization', `Bearer ${token}`)
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
        var error = "no event emitted"
        emitter.once("control:auto:on", () => {
            error = undefined
        });
        postState("on").end(() => done(error));
    });

    it("should raise control:auto:off event", (done) => {
        var error = "no event emitted"
        emitter.once("control:auto:off", () => {
            error = undefined
        });
        postState("off").end(() => done(error));
    });

    it("should respond on to GET if auto mode on.", (done) => {
        state.auto = true;
        request(server.app)
            .get("/api/auto")
            .set('Authorization', `Bearer ${token}`)
            .expect({ state: "on" }, done);
    });

    it("should respond off to GET if auto mode off.", (done) => {
        state.auto = false;
        request(server.app)
            .get("/api/auto")
            .set('Authorization', `Bearer ${token}`)
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
            .set('Authorization', `Bearer ${token}`)
            .expect(state.weather, done);
    });

    it("should respond with empty object if the weather object is undefined", (done) => {
        state.weather = undefined;

        request(server.app)
            .get("/api/weather")
            .set('Authorization', `Bearer ${token}`)
            .expect({}, done);
    });
});
