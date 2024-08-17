const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { expressjwt: jwt } = require("express-jwt");
const api = require("./api");

function server(emitter, state, logger) {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());
    app.use(methodOverride());

    app.use(express.static(__dirname + "/../client/build"));

    const authenticate = jwt({
        secret: process.env.SUPABASE_JWT_SECRET,
        algorithms: ['HS256']
    });

    app.use("/api", authenticate);

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
