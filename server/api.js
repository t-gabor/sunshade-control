const Router = require("express").Router;

module.exports = (emitter, state, logger) => {

    function badRequest(body, next) {
        if (logger) {
            logger.error(body);
        }
        const error = new Error("Bad Request");
        error.status = 400;
        next(error);
    }

    const router = Router();

    router.post("/control", (req, res, next) => {

        if (!req.body.state) {
            badRequest(req.body, next);
        } else if (req.body.state === "open") {
            emitter.emit("control:manual:open");
            res.sendStatus(200);
        } else if (req.body.state === "close") {
            emitter.emit("control:manual:close");
            res.sendStatus(200);
        } else if (req.body.state === "update") {
            emitter.emit("control:update");
            res.sendStatus(200);
        } else {
            badRequest(req.body, next);
        }
    });

    router.get("/auto", (req, res) => {
        res.send({ state: state.auto ? "on" : "off" });
    });

    router.post("/auto", (req, res, next) => {

        if (!req.body.state) {
            if (logger) {
                logger.error(req.body);
            }
            badRequest(req.body, next);
        } else if (req.body.state === "on") {
            emitter.emit("control:auto:on");
            res.sendStatus(200);
        } else if (req.body.state === "off") {
            emitter.emit("control:auto:off");
            res.sendStatus(200);
        } else {
            badRequest(req.body, next);
        }
    });

    router.get("/weather", (req, res) => {
        let response = state.weather;
        if (!response) {
            response = {};
        }
        res.send(response);
    });

    return router;
};

