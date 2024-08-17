const Gpio = require("onoff").Gpio;

const openButton = new Gpio(522, "low");
const closeButton = new Gpio(536, "low");

function activateButton(button) {
    button.write(1, (err) => {
        if (err) throw err;

        setTimeout(() => {
            button.write(0, () => { });
        }, 300);
    });
}

module.exports = logger => ({
    open: () => {
        activateButton(openButton);
        logger.info("Open.");
    },
    close: () => {
        activateButton(closeButton);
        logger.info("Close.");
    }
});
