const { Command, flags } = require("@oclif/command");
const IPFS = require("ipfs");
const CID = require("cids");
const uint8ArrayToString = require("uint8arrays/to-string");
const Block = require("multiformats/block");
const codec = require("@ipld/dag-cbor");
const multihashing = require("multihashing-async");
const getDefaultConfig = require("../runtime/config-nodejs");
const fetch = require("node-fetch");
const qrcode = require("qrcode-terminal");
const { hasher } = require("multiformats");
const utf8ArrayFromString = require("uint8arrays/from-string");

function postData(url, data) {
  // Default options are marked with *
  return fetch(url, {
    body: JSON.stringify(data), // must match 'Content-Type' header
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, same-origin, *omit
    headers: {
      "user-agent": "Mozilla/4.0 MDN Example",
      "content-type": "application/json",
    },
    method: "POST",
    mode: "cors", // no-cors, cors, *same-origin
    redirect: "follow", // manual, *follow, error
    referrer: "no-referrer", // *client, no-referrer
  }).then((response) => response.json()); // output JSON
}

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
      await logChunks(process.stdin);
    }
  }

  async run() {
    const { flags } = this.parse(DIDCommand);
    if (!flags.ddoc) {
      if (DIDCommand.stdin) {
        flags.ddoc = DIDCommand.stdin.toString("utf-8");
      } else {
        console.error(
          `-dd or --ddoc is required, or pipe from "ipdid signer" stdout`
        );
      }
    }

    const defaultOptions = getDefaultConfig();
    //console.log(flags.ddoc);
    const ipfs = await IPFS.create({
      libp2p: {}, //defaultOptions,
    });

    const get = async (obj) => {
      const cid = new CID(obj);
      const block = await ipfs.block.get(cid);
      const data = codec.decode(block.data);
      return data;
    };

    const saveJSON = async (diddoc) => {
      try {
        //console.log(JSON.parse(diddoc));
        const cid = await save(diddoc);
        const obj = JSON.parse(diddoc);
        return { cid: cid, obj: obj };
      } catch (error) {
        const err = `DID doc must contains a JSON document: ${error}`;
        console.log(err);
        const errorCID = new CID("error: ddoc not an object in JSON");
        const empty = {};
        return { cid: errorCID, obj: empty };
      }
    };

    // obj is a json Object
    const save = async (obj) => {
      try {
        // obj is a string of JSON object
        //console.log(typeof obj === 'string')
        //       const data = block.encode();
        const bytes = utf8ArrayFromString(obj);

        const multihash = await multihashing(bytes, "sha2-256");
        const cid = new CID(0, "dag-pb", multihash);

        // js-ipfs uses an older CID value type so we must convert to string
        const node = await ipfs.block.put(bytes, { cid: cid.toString() });
        console.log(node.cid);
        console.log("🇯🇵");
        const result = await ipfs.block.get(node.cid);
        console.log(result);
        console.log("🇯🇵");
        //await ipfs.stop(); // not sync with ipfs node yet.

        const name = "/ipfs/QmaMLRsvmDRCezZe2iebcKWtEzKNjBaQfwcu7mcpdm8eY2";
        //const value = '/ipns/QmVMxjouRQCA2QykL5Rc77DvjfaX6m8NL6RyHXRTaZ9iya'
        const nameDefaultOptions = {
          resolve: true,
          lifetime: "24h",
          key: "self",
          ttl: "",
          timeout: undefined,
        };
        const resolver = await ipfs.name.publish(name, nameDefaultOptions);
        //const test = await ipfs.name.resolve(value)
        //console.log(test)

        return cid;
      } catch (err) {
        console.log(`The ipfs up block fail. error: ${err}`);
        //await ipfs.stop();
      }
    };

    const x = await saveJSON(flags.ddoc);
    const p = x.cid;
    const docObj = x.obj;
    const cid = p.toString();
    const did = docObj.id.toString();
    console.log(`🐝 your CID is ${cid}`);
    console.log(`🙀 your DID is ${did}`);
    qrcode.generate(did);
    this.log(`🎉  genreating a QR-code on terminal for string: ${did}`);

    if (cid && did) {
      postData(
        "https://universal-resolver-driver-frankwang95174.vercel.app/did",
        {
          did: did,
          cid: cid,
        }
      )
        .then((data) => {
          //console.log(data)
          console.log(
            `🙀 your CID had been post to SKALE network, you can test with https://universal-resolver-driver-frankwang95174.vercel.app/1.0/identifiers/${did}`
          );
          // hope exit work hurt
          if (ipfs.isOnline()) {
            ipfs.stop();
          }
          process.exit(0);
        })
        .catch((error) => console.error(error));
    }

    console.log(
      `👽 you can inspect it here 👽 ->  https://ipfs.infura.io:5001/api/v0/block/get?arg=${p.toString()}`
    );
    // console.log(`🙀 CTL-C to terminate. (after make sure DID document is sync to ipfs network)`);
  }
}

DIDCommand.description = `register a PDID to SKALE network and IPFS (IPLD) - use pipe only
...
you can pipe any DID document to generate and register a DID
`;

module.exports = DIDCommand;
