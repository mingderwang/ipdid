const { Command, flags } = require("@oclif/command");
const PeerId = require("peer-id");
const path = require("path");
const os = require("os");
const jsonfile = require("jsonfile");
const CID = require("cids");
const multihashing = require("multihashing-async");
const qrcode = require('qrcode-terminal')

const file = "./.ipdid_keystore.json";
const filePath = path.resolve(os.homedir(), file);

const writeJSON = (obj) => {
  jsonfile
    .writeFile(filePath, obj)
    .then((res) => {
      //    console.log('Write  ~/.ipdid_keystore.json complete')
    })
    .catch((error) => { 
      console.error(error)
      console.log('🦄 check ~/.ipdid_keystore.json file permission')
    });
};

class MyDIDCommand extends Command {

  static flags = {
    qrcode: flags.boolean({
      char: "q",
      default: false,
      description: "generate and show DID QR code (default: false)",
      // allowNo: true
    }),
  };

  async run() {
    const { flags } = this.parse(MyDIDCommand);
    var keyPair = {};
    var did = {};

    // Required to set up a suite instance with private key
    const {
      Ed25519VerificationKey2020,
    } = require("@digitalbazaar/ed25519-verification-key-2020");
    const {
      Ed25519Signature2020,
    } = require("@digitalbazaar/ed25519-signature-2020");

    const tmpkeyPair = await Ed25519VerificationKey2020.generate();

    const getDID = async (keyPair) => {
      const fingerprint = keyPair.fingerprint();
      const bytes = new TextEncoder("utf8").encode(fingerprint);
      const hash = await multihashing(bytes, "sha2-256");
      const cid = new CID(0, "dag-pb", hash);

      const didipdid = "did:ipdid:" + cid.toString();
      console.log(`${didipdid}`);
      if (flags.qrcode) {
        qrcode.generate(didipdid);
        this.log(`🎉  genreating a QR-code on terminal for string: ${didipdid}`);
      }

      did = {
        "@context": "https://w3id.org/did/v1",
        id: didipdid,
        publicKey: [
          {
            id: didipdid,
            type: keyPair.type,
            controller: didipdid,
            publicKeyMultibase: keyPair.publicKeyMultibase,
          },
        ],
      };
      /*
      this.log(
        `👻 your signer saved in ~/.ipdid_keystore.json is ${JSON.stringify(
          keyPair,
          null,
          2
        )}`
      );
*/
      return did;
    };

    jsonfile
      .readFile(filePath)
      .then(async (obj) => {
        // use old keyPair
        keyPair = await Ed25519VerificationKey2020.from(obj);

        let did = await getDID(keyPair);
        //console.log(JSON.stringify(did));
        return did;
      })
      .catch(async (error) => {
        console.log('🦄 create a new one')
        // create a new one
        keyPair = tmpkeyPair;
        writeJSON(tmpkeyPair);
        console.error(error);

        let did = await getDID(keyPair);
        console.log(JSON.stringify(did));
        return did;
      });
  }
}

MyDIDCommand.description = `return your current DID
...
show your current DID code 
`;

module.exports = MyDIDCommand;
