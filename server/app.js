const bunyan = require("bunyan");
const Server = require("./server");

const logger = bunyan.createLogger({ name: "sunshade-control" });
const server = new Server(logger);
