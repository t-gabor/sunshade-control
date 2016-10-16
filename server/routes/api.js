const Router = require("express").Router;

const router = Router();
module.exports = router;

router.post("/control", (req, res, next) => {
    function badRequest() {
        const error = new Error("Bad Request");
        error.status = 400;
        next(error);
    }

    if (!req.body.state) {
        badRequest();
    } else if (req.body.state === "open") {
        req.app.emit("control:open");
        res.sendStatus(200);
    } else if (req.body.state === "close") {
        req.app.emit("control:close");
        res.sendStatus(200);
    } else {
        badRequest();
    }
});
