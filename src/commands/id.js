const { Command, flags } = require("@oclif/command");
const PeerId = require("peer-id");

class IdCommand extends Command {
  async run() {
    const id = await PeerId.create({ bits: 1024, keyType: "RSA" });
    const json = "did:ipdid:" + id.toJSON().id;
    this.log(`local DID is ${json}`);
  }
}

IdCommand.description = `show your DID
...
show your DID in details
`;

IdCommand.flags = {
  version: flags.version(),
  help: flags.help(),
  // run with --dir= or -d=
  dir: flags.string({
    char: "d",
    default: process.cwd(),
  }),
};

module.exports = IdCommand;
