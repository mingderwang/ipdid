const { Command, flags } = require("@oclif/command")
const qrcode = require('qrcode-terminal')

class QRCommand extends Command {

  async init() {
    async function logChunks(readable) {
      for await (const chunk of readable) {
        QRCommand.stdin = chunk
      }
    }

    const { flags } = this.parse(QRCommand);
    if (flags.context === undefined) {
      await logChunks(process.stdin)
    }
  }

  async run() {
    const { flags } = this.parse(QRCommand);
    console.log(flags)
    if (!flags.context) {
      if (QRCommand.stdin) {
        flags.context = QRCommand.stdin.toString('utf-8')
      } else {
        console.error(`-c or --context is required, or pipe a text in`);
      }
    }
    const context = flags.context || '0x8587eA108898749538372Cd3Df459870C4a1A56F';
    this.log(`genreate QR-code in terminal for string: ${context}`);
    const cleanContext = context.replace(/[\n\r]/gi, "");
    qrcode.generate(cleanContext); 
  }
}

QRCommand.description = `to generate a QR-code from your context or stdin
...
--context string (default for testing: '0x8587eA108898749538372Cd3Df459870C4a1A56F')
`;

QRCommand.flags = {
  context: flags.string({
     char: "c", 
     description: "the context for generating a QR-code" 
   }),
};

module.exports = QRCommand;
