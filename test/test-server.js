const request = require("supertest");
const server = require("../server/server")({
    info: () => { },
    error: () => { },
});

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

    function postState(state) {
        return request(server.app)
            .post("/api/control")
            .set("Content-Type", "application/json")
            .send(`{"state": "${state}"}`);
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
        server.app.once("control:manual:open", () => {
            done();
        });
        postState("open").end();
    });

    it("should raise control:manual:close event", (done) => {
        server.app.once("control:manual:close", () => {
            done();
        });
        postState("close").end();
    });
});

describe("#/api/auto", () => {

    after(() => {
        server.server.close();
    });

    it("should respond 404 to GET", (done) => {
        request(server.app)
            .get("/api/auto")
            .expect(404, done);
    });

    it("should respond 400 to marlformed request", (done) => {
        request(server.app)
            .post("/api/auto")
            .set("Content-Type", "application/json")
            .send("a=1")
            .expect(400, done);
    });

    function postState(state) {
        return request(server.app)
            .post("/api/auto")
            .set("Content-Type", "application/json")
            .send(`{"state": "${state}"}`);
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
        server.app.once("control:auto:on", () => {
            done();
        });
        postState("on").end();
    });

    it("should raise control:auto:off event", (done) => {
        server.app.once("control:auto:off", () => {
            done();
        });
        postState("off").end();
    });
});
