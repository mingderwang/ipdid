const { Command, flags } = require("@oclif/command");
const getDefaultConfig = require("../runtime/config-nodejs");
const IPFS = require("ipfs");
const CID = require("cids");
const uint8ArrayFromString = require("uint8arrays/from-string");
const uint8ArrayToString = require("uint8arrays/to-string");
const Block = require("@ipld/block/defaults");
const { encode, decode } = require("@ipld/dag-cbor");
const { Key, MemoryDatastore } = require("interface-datastore");
const MountStore = require("datastore-core").MountDatastore;
const mds = new MemoryDatastore();
const PeerId = require('peer-id')
const m = new MountStore([

  {
    datastore: mds,
    prefix: new Key("cool"),
  },
]);

class InitCommand extends Command {
  async run() {
    //  const {flags} = this.parse(InitCommand)
    //  const name = flags.name |)| 'world'

    const diddoc = `
	  {
  "@context": "https://w3id.org/did-resolution/v1",
  "didDocument": {
    "@context": [
      "https://www.w3.org/ns/did/v1",
      {
        "@base": "did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"
      }
    ],
    "id": "did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4",
    "verificationMethod": [
      {
        "id": "#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4",
        "type": "JsonWebKey2020",
        "controller": "did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4",
        "publicKeyJwk": {
          "kty": "EC",
          "crv": "P-521",
          "x": "AM69gt-ljp0G2BAwA2MIwxdIIeXFobPbeyYhn1A7hSD5QJzDy1Mo3mlkIe28ITqbofXpWb8X717ZvVDXv_nz9SaK",
          "y": "AMelyc6QcN3u5iSRA41GIWtzGg6HDGtVUDCPqT5WPtvqQNLiilt8_Bv6beOeJVf4YX2wZeu6R3Ch5IrCkooRpje7"
        }
      }
    ],
    "authentication": [
      "#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"
    ],
    "assertionMethod": [
      "#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"
    ],
    "capabilityInvocation": [
      "#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"
    ],
    "capabilityDelegation": [
      "#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"
    ],
    "keyAgreement": [
      "#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"
    ]
  },
  "didDocumentMetadata": {
    "content-type": "application/did+json"
  },
  "didResolutionMetadata": {}
}
`;
    console.log(diddoc);
    const val = uint8ArrayFromString(diddoc);
    await m.put(
      new Key("/cool/did:ipdid:QmaYBs1gdu2Q6DAcfHVVq4NqysfbrHjnTzhUdajWyrDYxq"),
      val
    );
    const res = await mds.get(
      new Key("did:ipdid:QmaYBs1gdu2Q6DAcfHVVq4NqysfbrHjnTzhUdajWyrDYxq")
    );
    console.log(uint8ArrayToString(res));

    const defaultOptions = {}; // getDefaultConfig();
    const ipfs = await IPFS.create({
      libp2p: defaultOptions,
    });

    const id = await ipfs.id()
    const config = await ipfs.config.getAll()
    const peerId = await PeerId.createFromPrivKey(config.Identity.PrivKey)
    console.log("peerId 🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝  xxx")
    console.log(id.id)
    console.log(peerId.toB58String())
    console.log(peerId.privKey)
    console.log("🐝 🐝 🐝 🐝 🐝 🐝 🐝 🐝  xxx")

    const get = async (obj) => {
      const cid = new CID(obj);
      const block = await ipfs.block.get(cid);
      const data = decode(block.data);
      return data;
    };

    const save = async (obj) => {
      const block = Block.encoder(obj, "dag-cbor");
      const data = block.encode();
      const cid = await block.cid();

      // js-ipfs uses an older CID value type so we must convert to string
      await ipfs.block.put(data, { cid: cid.toString() });
      return cid;
    };

    const skating = await save("skating");
    /*
    const rowing = await save("rowing");
    const running = await save("running");

    const mikeal = await save({ name: "Mikeal", interests: [skating] });
    const robert = await save({ name: "Robert", interests: [rowing, running] });
    const steve = await save({ name: "Steve", interests: [running, skating] });

    console.log("Seeding Mikeal as ", mikeal.toString());
    console.log("Seeding Robert as ", robert.toString());
    console.log("Seeding Steve as ", steve.toString());
    */
    console.log(await get(skating.toString()));
    console.log(skating);
  }
}

InitCommand.description = `create a new IPDID ipfs
...
Extra documentation goes here
`;

InitCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" }),
};

module.exports = InitCommand;
