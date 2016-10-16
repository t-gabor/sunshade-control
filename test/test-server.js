const Server = require("../server/server");
const assert = require("assert");
const http = require("http");
const fetch = require("node-fetch");

describe("#/api/control", () => {
    const server = new Server({
        info: () => { },
        error: () => { },
    });

    after(() => {
        server.server.close();
    });

    it("should respond 404 to GET", (done) => {
        fetch("http://localhost:3000/api/control")
            .then((res) => {
                assert.equal(404, res.status);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should respond 400 to marlformed request", (done) => {
        fetch("http://127.0.0.1:3000/api/control", { method: "POST", body: "a=1" })
            .then((res) => {
                assert.equal(400, res.status);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    function postState(state) {
        return fetch("http://127.0.0.1:3000/api/control", {
            method: "POST",
            body: `{"state": "${state}"}`,
            headers: {
                "Content-Type": "application/json",
            } });
    }

    it("should respond 200 to open request", (done) => {
        postState("open")
            .then((res) => {
                assert.equal(200, res.status);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should respond 200 to close request", (done) => {
        postState("close")
            .then((res) => {
                assert.equal(200, res.status);
                done();
            })
            .catch((err) => {
                done(err);
            });
    });

    it("should raise control:open event", (done) => {
        server.app.once("control:open", () => {
            done();
        });
        postState("open")
            .catch((err) => {
                done(err);
            });
    });

    it("should raise control:close event", (done) => {
        server.app.once("control:close", () => {
            done();
        });
        postState("close")
            .catch((err) => {
                done(err);
            });
    });
});
