function sunshadeRemote(emitter, buttons) {
    let auto = false;

    emitter.on("control:open", () => {
        if (auto) {
            buttons.open();
        }
    });
    emitter.on("control:close", () => {
        if (auto) {
            buttons.close();
        }
    });
    emitter.on("control:auto:on", () => {
        auto = true;
    });
    emitter.on("control:auto:off", () => {
        auto = false;
    });
    emitter.on("control:manual:open", () => {
        buttons.open();
    });
    emitter.on("control:manual:close", () => {
        buttons.close();
    });

    return {
        open: (cb) => {
            buttons.open(cb);
        },
        close: (cb) => {
            buttons.close(cb);
        }
    };
}

module.exports = sunshadeRemote;
