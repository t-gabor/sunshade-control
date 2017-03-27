const Router = require("express").Router;

const router = Router();
module.exports = router;

function badRequest(next) {
    const error = new Error("Bad Request");
    error.status = 400;
    next(error);
}

router.post("/control", (req, res, next) => {

    if (!req.body.state) {
        badRequest(next);
    } else if (req.body.state === "open") {
        req.app.emit("control:manual:open");
        res.sendStatus(200);
    } else if (req.body.state === "close") {
        req.app.emit("control:manual:close");
        res.sendStatus(200);
    } else {
        badRequest(next);
    }
});

router.post("/auto", (req, res, next) => {

    if (!req.body.state) {
        badRequest(next);
    } else if (req.body.state === "on") {
        req.app.emit("control:auto:on");
        res.sendStatus(200);
    } else if (req.body.state === "off") {
        req.app.emit("control:auto:off");
        res.sendStatus(200);
    } else {
        badRequest(next);
    }
});
