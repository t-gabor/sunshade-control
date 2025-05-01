module.exports = logger => {
    const remote = require("./somfy-remote")(logger);
    return {
        open: async () => {
            logger.info("Open.");
            await remote.open();
        },
        close: async () => {
            logger.info("Close.");
            await remote.close();;
        }
    }
};