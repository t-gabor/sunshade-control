class SunshadeRemote {
    constructor(emitter, buttons) {
        this.buttons = buttons;
        this.auto = false;

        const self = this;
        emitter.on("control:open", () => {
            if (self.auto) {
                self.buttons.open();
            }
        });
        emitter.on("control:close", () => {
            if (self.auto) {
                self.buttons.close();
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
