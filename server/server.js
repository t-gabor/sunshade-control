const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const api = require("./api");

function server(emitter, state, logger) {
    const app = express();

    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use("/api", api(emitter, state, logger));

    if (process.env.NODE_ENV === "production") {
        app.use(express.static("client/build"));
    }

    app.use((err, req, res, next) => {
        if (!err) {
            next();
        }

        logger.error(err);
        res.status(err.status || 500);
        res.send(err.message);
    });

    const port = process.env.PORT || 3001;
    return {
        app,
        server: app.listen(port, () => {
            logger.info(`Listening on port ${port}`);
        })
    };
}

module.exports = server;
