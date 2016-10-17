const Server = require("../server/server");
const http = require("http");
const request = require("supertest");

describe("#/api/control", () => {
    const server = new Server({
        info: () => { },
        error: () => { },
    });

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

    it("should raise control:open event", (done) => {
        server.app.once("control:open", () => {
            done();
        });
        postState("open").end();
    });

    it("should raise control:close event", (done) => {
        server.app.once("control:close", () => {
            done();
        });
        postState("close").end();
    });
});
