const RADIO_PIN = 4;
const DEFAULT_REMOTE_ADDRESS = 0x269326
const SYMBOL_LENGTH = 640;
const BUTTON_UP = 0x2;
const BUTTON_DOWN = 0x4;
const BUTTON_PROG = 0x8;

const jsonfile = require('jsonfile');
const pigpio = require('pigpio-client').pigpio({ host: process.env.PIGPIOD_HOST ?? 'localhost' });
pigpio.once('connected', async () => {

    const radioPin = pigpio.gpio(RADIO_PIN);
    await radioPin.modeSet('output');
    await radioPin.write(0);
});

function byteToHex(byte) {
    let hex = [];
    hex.push('0');
    hex.push('x');
    let current = byte < 0 ? byte + 256 : byte;
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xF).toString(16));
    return hex.join("")
}

function bytesToHex(bytes) {
    return bytes.map(byteToHex).join(", ");
}

async function createSomfyJson() {
    var filePath = process.env.SOMFY_CONFIG ?? "./somfy.json";
    var defaultConfig = {
        remoteAddress: DEFAULT_REMOTE_ADDRESS,
        rollingCode: 0
    }

    await jsonfile.writeFile(filePath, defaultConfig, { spaces: 2 });
}

async function readConfig() {
    var filePath = process.env.SOMFY_CONFIG ?? "./somfy.json";
    return await jsonfile.readFile(filePath);
}

async function writeConfig(config) {
    var filePath = process.env.SOMFY_CONFIG ?? "./somfy.json";
    await jsonfile.writeFile(filePath, config, { spaces: 2 });
}

module.exports = logger => {

    function createCommandFrame(shutterAddress, rollingCode, button) {

        logger.debug("Remote : 0x" + shutterAddress.toString(16));
        logger.debug("Button : 0x" + button.toString(16));
        logger.debug("Rolling code : " + rollingCode);

        var frame = [
            0xa7, // Encryption key. Doesn't matter much
            button << 4, // Which button did  you press? The 4 LSB will be the checksum
            rollingCode >> 8, // Rolling code (big endian)
            rollingCode & 0xff,
            shutterAddress >> 16,
            (shutterAddress >> 8) & 0xff,
            shutterAddress & 0xff
        ];
        logger.debug("Frame: " + bytesToHex(frame));

        var checksum = 0;
        for (i = 0; i < 7; i++) {
            checksum = checksum ^ frame[i] ^ (frame[i] >> 4)
        }
        checksum &= 0b1111;
        frame[1] |= checksum;
        logger.debug("Frame with checksum: " + bytesToHex(frame));

        for (i = 0; i < 7; i++) {
            frame[i] ^= frame[i - 1];
        }
        logger.debug("Frame obfuscated: " + bytesToHex(frame));

        return frame;
    }

    function getManchesterCodeForFrame(frame) {
        var result = [];

        for (i = 0; i < 56; i++) {
            if ((frame[Math.floor(i / 8)] >> (7 - (i % 8))) & 1) {
                result.push([0, 1, SYMBOL_LENGTH]);
                result.push([1, 0, SYMBOL_LENGTH]);
            }
            else {
                result.push([1, 0, SYMBOL_LENGTH]);
                result.push([0, 1, SYMBOL_LENGTH]);
            }
        }
        return result;
    }

    async function sendFrame(frame, repetition) {
        const ready = new Promise((resolve, reject) => {
            pigpio.once('connected', resolve);
            pigpio.once('error', reject);
        });

        pigpio.connect();
        const info = await ready;
        logger.debug(info);
        const radioPin = pigpio.gpio(RADIO_PIN);
        await radioPin.modeSet('output');

        var manchesterCodeForFrame = getManchesterCodeForFrame(frame)

        var wakeUp = [
            [1, 0, 9415], // wake up pulse
            // silence
            [0, 1, 89565]
        ];

        var pulse = [
            // hw sync 
            [1, 0, 4 * SYMBOL_LENGTH],
            [0, 1, 4 * SYMBOL_LENGTH],
            [1, 0, 4 * SYMBOL_LENGTH],
            [0, 1, 4 * SYMBOL_LENGTH],
            // sw sync
            [1, 0, 4550],
            [0, 1, SYMBOL_LENGTH]]
            .concat(manchesterCodeForFrame)
            // inter frame gap
            .concat([[0, 1, 30415]]);

        const repeat = (arr, n) => [].concat(...Array(n).fill(arr));

        var pulse = wakeUp.concat(repeat(pulse, repetition));

        logger.info("Sending frame...");

        await radioPin.waveClear();
        await radioPin.waveAddPulse(pulse);
        const wave = await radioPin.waveCreate();
        await radioPin.waveSendOnce(wave);
        await radioPin.waveNotBusy();

        logger.info("Frame sent.");

        await radioPin.waveDelete(wave);
        await pigpio.end();
    }

    async function sendCommand(button) {
        logger.info('Sending command: 0x' + button.toString(16));
        const config = await readConfig();
        const frame = createCommandFrame(config.remoteAddress, config.rollingCode, button);
        await sendFrame(frame, 2);
        config.rollingCode += 1;
        await writeConfig(config);
    }

    return {
        open: () => sendCommand(BUTTON_DOWN),
        close: () => sendCommand(BUTTON_UP),
        prog: () => sendCommand(BUTTON_PROG),
        newConfig: () => createSomfyJson()
    }
};
