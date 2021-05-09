const { Command, flags } = require("@oclif/command");
const qrcode = require("qrcode-terminal");

class QRCommand extends Command {
  async init() {
    async function logChunks(readable) {
      for await (const chunk of readable) {
        QRCommand.stdin = chunk;
      }
    }

    const { flags } = this.parse(QRCommand);
    if (flags.context === undefined) {
      await logChunks(process.stdin);
    }
  }

  async run() {
    const { flags } = this.parse(QRCommand);
    console.log(flags);
    if (!flags.context) {
      if (QRCommand.stdin) {
        flags.context = QRCommand.stdin.toString("utf-8");
      } else {
        console.error(`-c or --context is required, or pipe a text in`);
      }
    }
    const context = flags.context || "test string";
    this.log(`genreate QR-code in terminal for string: ${context}`);
    const cleanContext = context.replace(/[\n\r]/gi, "");
    qrcode.generate(cleanContext);
  }
}

QRCommand.description = `to generate a QR-code from your context or stdin
...
--context string 
for example: ipdid qrcode -c 'test string' 
or: echo 'test string' | ipdid qrcode

`;

QRCommand.flags = {
  context: flags.string({
    char: "c",
    description: "the context for generating a QR-code",
  }),
};

module.exports = QRCommand;
