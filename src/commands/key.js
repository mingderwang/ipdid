const { Command, flags } = require("@oclif/command");

class KeyCommand extends Command {
  async run() {
    const { flags } = this.parse(KeyCommand);
    const long = flags.long || "format";
    this.log(`show DID key pair ${long} from ./src/commands/key.js`);
  }
}

KeyCommand.description = `show your DID key pair
...
--long format
`;

KeyCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" }),
};

module.exports = KeyCommand;
