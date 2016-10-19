class SunshadeRemote {
    constructor(emitter, buttons) {
        this.buttons = buttons;
        this.auto = false;

        emitter.on("control:open", () => {
            if (this.auto) {
                this.buttons.open();
            }
        });
        emitter.on("control:close", () => {
            if (this.auto) {
                this.buttons.close();
            }
        });
    }

    open(cb) {
        this.buttons.open(cb);
    }

    close(cb) {
        this.buttons.close(cb);
    }

    automatic(auto) {
        this.auto = auto;
    }
}

module.exports = SunshadeRemote;
