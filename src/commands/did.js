const { Command, flags } = require("@oclif/command");
const getDefaultConfig = require("../runtime/config-nodejs");
const IPFS = require("ipfs");
const CID = require("cids");
const uint8ArrayFromString = require("uint8arrays/from-string");
const uint8ArrayToString = require("uint8arrays/to-string");
const Block = require("@ipld/block/defaults");
const { encode, decode } = require("@ipld/dag-cbor");

class InitCommand extends Command {
  async run() {
    const defaultOptions = getDefaultConfig();
    const ipfs = await IPFS.create({
      libp2p: defaultOptions,
    });

    const fileAdded = await ipfs.add({
      path:
        "did:ipdid:bafyreicwxnezzqppzskolg6pvwu2ri5pnepjvbsvgzpb4nn7devfxpskrm",
      content:
        '{"@context":["https://www.w3.org/ns/did/v1",{"@base":"did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"}],"id":"did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4","verificationMethod":[{"id":"#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4","type":"JsonWebKey2020","controller":"did:key:zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4","publicKeyJwk":{"kty":"EC","crv":"P-521","x":"AM69gt-ljp0G2BAwA2MIwxdIIeXFobPbeyYhn1A7hSD5QJzDy1Mo3mlkIe28ITqbofXpWb8X717ZvVDXv_nz9SaK","y":"AMelyc6QcN3u5iSRA41GIWtzGg6HDGtVUDCPqT5WPtvqQNLiilt8_Bv6beOeJVf4YX2wZeu6R3Ch5IrCkooRpje7"}}],"authentication":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"assertionMethod":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"capabilityInvocation":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"capabilityDelegation":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"],"keyAgreement":["#zJss7x7sfKdbFk4racv8zTnMSyQb2mYsKTHXRxfLKaQCd9DxxwjmTdTBjoPr6yhQM5ZU4rLUFyFkHV2u7mYs6tTxDuPd51Qx7NwzwXWYST5mYBybEXhVGLvj58M3n27CVPd3uhqb5QYLigR4CAsaR5FCSyjGYJpRBQfHKk4MDwMbTa4F5bDF8o1V4"]}',
    });

    console.log("Added file:", fileAdded.path, fileAdded.cid);

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
  }
}

InitCommand.flags = {
  name: flags.string({ char: "n", description: "name to print" }),
};

module.exports = InitCommand;
