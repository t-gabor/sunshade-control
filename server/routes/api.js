const Router = require("express").Router;

function badRequest(next) {
    const error = new Error("Bad Request");
    error.status = 400;
    next(error);
}

module.exports = (emitter, state) => {
    const router = Router();

    router.post("/control", (req, res, next) => {

        if (!req.body.state) {
            badRequest(next);
        } else if (req.body.state === "open") {
            emitter.emit("control:manual:open");
            res.sendStatus(200);
        } else if (req.body.state === "close") {
            emitter.emit("control:manual:close");
            res.sendStatus(200);
        } else {
            badRequest(next);
        }
    });

    router.get("/auto", (req, res) => {
        res.send({ state: state.auto ? "on" : "off" });
    });

    router.post("/auto", (req, res, next) => {

        if (!req.body.state) {
            badRequest(next);
        } else if (req.body.state === "on") {
            emitter.emit("control:auto:on");
            res.sendStatus(200);
        } else if (req.body.state === "off") {
            emitter.emit("control:auto:off");
            res.sendStatus(200);
        } else {
            badRequest(next);
        }
    });

    return router;
};

