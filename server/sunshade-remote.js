function sunshadeRemote(emitter, buttons, state) {
    emitter.on("control:open", () => {
        if (state.auto) {
            buttons.open();
        }
    });
    emitter.on("control:close", () => {
        if (state.auto) {
            buttons.close();
        }
    });
    emitter.on("control:auto:on", () => {
        state.auto = true;
    });
    emitter.on("control:auto:off", () => {
        state.auto = false;
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
