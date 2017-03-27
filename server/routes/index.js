const api = require("./api");

module.exports = (app, emitter, state) => {
    app.use("/api", api(emitter, state));
};
