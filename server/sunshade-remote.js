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

    return {
        open: (cb) => {
            buttons.open(cb);
        },
        close: (cb) => {
            buttons.close(cb);
        },
        automatic: (a) => {
            auto = a;
        }
    };
}

module.exports = sunshadeRemote;
