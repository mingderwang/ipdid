const { Command, flags } = require("@oclif/command");
const Libp2p = require("libp2p");
const TCP = require("libp2p-tcp");
const { NOISE } = require("libp2p-noise");

class ServeCommand extends Command {
  async run() {
    const node = await Libp2p.create({
      modules: {
        transport: [TCP],
        connEncryption: [NOISE],
      },
    });

    // start libp2p
    await node.start();
    console.log("libp2p has started");

    // print out listening addresses
    console.log("listening on addresses:");
    node.multiaddrs.forEach((addr) => {
      console.log(`${addr.toString()}/p2p/${node.peerId.toB58String()}`);
    });

    // stop libp2p
    await node.stop();
    console.log("libp2p has stopped");

    const { flags } = this.parse(ServeCommand);
    const log = flags.log || "format";
    this.log(`run a ${log} from ./src/commands/daemon.js`);
  }
}

ServeCommand.description = `start a IPDID node as daemon
...
Extra documentation goes here
`;

ServeCommand.flags = {
  log: flags.string({ char: "l", description: "show logs" }),
};

module.exports = ServeCommand;
