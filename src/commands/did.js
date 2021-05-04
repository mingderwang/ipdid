const { Command, flags } = require("@oclif/command");
const IPFS = require("ipfs");
const CID = require("cids");
const uint8ArrayFromString = require("uint8arrays/from-string");
const uint8ArrayToString = require("uint8arrays/to-string");
const Block = require("@ipld/block/defaults");
const { encode, decode } = require("@ipld/dag-cbor");

class InitCommand extends Command {
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
  async run() {
    const { flags } = this.parse(InitCommand);
    console.log(flags);
    if (!flags.ddoc) {
      console.error(`-dd or --ddoc is require`);
      process.exit(1);
    }

    const ipfs = await IPFS.create({
      libp2p: {},
    });


    /*
    const fileAdded = await ipfs.addfileAdded = await ipfs.add({
      path:
        "did:ipdid:bafyreicwxnezzqppzskolg6pvwu2ri5pnepjvbsvgzpb4nn7devfxpskrm",
      content:
        '{"@context":["https://www.w3.org/ns/did/v1",{"@base":"did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"}],"id":"did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4","verificationMethod":[{"id":"#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4","type":"JsonWebKey2020","controller":"did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4","publicKeyJwk":{"kty":"EC","crv":"P-521","x":"AM69gt-ljp0G2BAwA2MIwxdIIeXFobPbeyYhn1A7hSD5QJzDy1Mo3mlkIe28ITqbofXpWb8X717ZvVDXv_nz9SaK","y":"AMelyc6QcN3u5iSRA41GIWtzGg6HDGtVUDCPqT5WPtvqQNLiilt8_Bv6beOeJVf4YX2wZeu6R3Ch5IrCkooRpje7"}}],"authentication":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"assertionMethod":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"capabilityInvocation":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"capabilityDelegation":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"keyAgreement":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"]}',
    });

    console.log("Added file:", fileAdded.path, fileAdded.cid);
    */

    const get = async (obj) => {
      const cid = new CID(obj);
      const block = await ipfs.block.get(cid);
      const data = decode(block.data);
      return data;
    };

    const saveJSON = async (diddoc) => {
      try {
        JSON.parse(diddoc);
        console.log(diddoc);
        return await save(diddoc);
      } catch (error) {
        const err = `DID doc must contains a JSON document: ${error}`;
        console.log(err);
        return new CID("error: ddoc not an object in JSON");
      }
    };

    const save = async (obj) => {
      try {
        // obj is a string of JSON object
        const block = Block.encoder(obj, "dag-cbor");
        const data = block.encode();
        const cid = await block.cid();

        // js-ipfs uses an older CID value type so we must convert to string
        await ipfs.block.put(data, { cid: cid.toString() });
        await ipfs.stop();
        return cid;
      } catch (err) {
        console.log(`The ipfs get block fail.`);
        await ipfs.stop();
      }
    };

    const p = await saveJSON(flags.ddoc);
    const cid = p.toString();
    console.log(`🙀 CID is ${cid}`);
    console.log(
      `👽 you can inspect it here 👽 ->  http://explore.ipld.io.ipns.localhost:8080/#/explore/${p.toString()}`
    );
    if(ipfs.isOnline()) {
      ipfs.stop()
    }
    process.exit(0)
  }
}

module.exports = InitCommand;
