const { Command, flags } = require("@oclif/command");
const IPFS = require("ipfs");
const CID = require("cids");
const uint8ArrayFromString = require("uint8arrays/from-string");
const uint8ArrayToString = require("uint8arrays/to-string");
const Block = require("ipld-block");
const { encode, decode } = require("@ipld/dag-cbor");

class DIDCommand extends Command {
  static flags = {
    ddoc: flags.string({
      char: "dd",
      description: "DID document",
    }),
    // can pass either --force or -f
    force: flags.boolean({
      char: "f",
      default: true,
      description: "force to register on ipfs block",
      // default value if flag not passed (can be a function that returns a boolean)
      // boolean flags may be reversed with `--no-` (in this case: `--no-force`).
      // The flag will be set to false if reversed. This functionality
      // is disabled by default, to enable it:
      // allowNo: true
    }),
  };


static stdin;

  async init() {

async function logChunks(readable) {
  for await (const chunk of readable) {
    // console.log(chunk);
    // console.log(chunk.toString('utf-8'))
    DIDCommand.stdin = chunk;
  }
}

    const { flags } = this.parse(DIDCommand);
    if (flags.ddoc === undefined) {
      await logChunks(process.stdin)
    } 

  }

  async run() {
    
    const { flags } = this.parse(DIDCommand);
    if (!flags.ddoc) {
      if (DIDCommand.stdin) {  
        flags.ddoc = DIDCommand.stdin.toString('utf-8')
      } else {
        console.error(`-dd or --ddoc is required, or pipe from "ipdid signer" stdout`);
      }
    }

    console.log(flags.ddoc);
    const ipfs = await IPFS.create({
      libp2p: {},
    });


/*
    const get = async (obj) => {
      const cid = new CID(obj);
      const block = await ipfs.block.get(cid);
      const data = decode(block.data);
      return data;
    };
*/

    const saveJSON = async (diddoc) => {
      try {
        console.log(JSON.parse(diddoc));
        return await save(diddoc);
      } catch (error) {
        const err = `DID doc must contains a JSON document: ${error}`;
        console.log(err);
        return new CID("error: ddoc not an object in JSON");
      }
    };

    // input obj is a json Object
    const save = async (obj) => {
      var cid;
      try {
        // obj is a string of JSON object
        const encoder = new TextEncoder('utf8')
        const docId = JSON.parse(obj).id
        const old = docId.split(':')[2]
        const cid = new CID(old)
        const block = new Block(encoder.encode(JSON.stringify(obj)), cid)

        // js-ipfs uses an older CID value type so we must convert to string
        const node = await ipfs.block.put(block);
        console.log(node)
        const result = await ipfs.block.get(node.cid);
        console.log(result.data)
        //await ipfs.stop(); // not sync with ipfs node yet.
        return cid;
      } catch (err) {
        console.log(`The ipfs up block fail. error: ${err}`);
        //await ipfs.stop();
      }
    };

    const p = await saveJSON(flags.ddoc);
    console.log(p)
    const cid = p.toString();
    console.log(`🙀 new DID is did:ipdid:${cid}`);
    console.log(
      `👽 you can inspect it here 👽 ->  http://explore.ipld.io.ipns.localhost:8080/#/explore/${p.toString()}`
    );
    console.log(`🙀 CTL-C to terminate. (after make sure DID document is sync to ipfs network)`);
    if(ipfs.isOnline()) {
      //ipfs.stop()
    }
    //process.exit(0)
  }
}

module.exports = DIDCommand;
