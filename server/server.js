const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const jwt = require("express-jwt");
const api = require("./api");

function server(emitter, state, logger) {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(methodOverride());

    if (process.env.NODE_ENV === "production") {
        app.use(express.static(__dirname + "/../client/build"));

        const auth0 = require("../config/auth0.server.json");
        const authenticate = jwt({
            secret: auth0.clientSecret,
            audience: auth0.clientId,
            algorithms: ['HS256']
        });

        app.use("/api", authenticate);
    }

    app.use("/api", api(emitter, state, logger));

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
