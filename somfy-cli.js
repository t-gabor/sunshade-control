const { Command } = require('commander');
const program = new Command();

var PrettyStream = require('bunyan-prettystream');

var prettyStdOut = new PrettyStream();
prettyStdOut.pipe(process.stdout);

const logger = require("bunyan").createLogger({
    name: "sunshade-control",
    stream: prettyStdOut,
    level: "debug"
});

const remote = require("./server/somfy-remote")(logger);

var condfigFilePath = process.env.SOMFY_CONFIG ?? "./somfy.json";

program
    .name('Somfy remote CLI')
    .description("Command line tool to send Somfy commands through Somfy RTS.")

program
    .command('new-config')
    .description('Create a new config file at ' + condfigFilePath)
    .action(async () => {
        {
            await remote.newConfig();
            logger.info('Created a new config file at ' + condfigFilePath);
            process.exit(0);
        }
    });

program
    .command('open')
    .description('Open(down) sunshade.')
    .action(async () => {
        {
            await remote.open();
            process.exit(0);
        }
    });

program
    .command('close')
    .description('Close(up) sunshade.')
    .action(async () => {
        {
            await remote.close();
            process.exit(0);
        }
    });

program
    .command('prog')
    .description('Press the program button.')
    .action(async () => {
        {
            await remote.prog();
            process.exit(0);
        }
    });

program.parse();
