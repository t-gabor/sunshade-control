const express = require("express");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const routes = require("./routes");

class Server {
    constructor(logger) {
        const port = process.env.PORT || 3000;
        const app = express();

        app.use(bodyParser.json());
        app.use(methodOverride());

        routes(app);

        app.use((err, req, res, next) => {
            if (!err) {
                next();
            }

            logger.error(err);
            res.status(err.status || 500);
            res.send(err.message);
        });

        this.app = app;
        this.server = app.listen(port, () => {
            logger.info(`Listening on port ${port}`);
        });
    }
}

module.exports = Server;
