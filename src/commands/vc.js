const { Command, flags } = require("@oclif/command");
const PeerId = require("peer-id");
const path = require("path");
const os = require("os");
const jsonfile = require("jsonfile");
const CID = require("cids");
const { monitorEventLoopDelay } = require("perf_hooks");
const multihashing = require("multihashing-async");

const file = "./.ipdid_keystore.json";
const filePath = path.resolve(os.homedir(), file);

const writeJSON = (obj) => {
  jsonfile
    .writeFile(filePath, obj)
    .then((res) => {
      //    console.log('Write  ~/.ipdid_keystore.json complete')
    })
    .catch((error) => console.error(error));
};

class VCCommand extends Command {
  static flags = {
    who: flags.string({
      char: "w",
      description: "user's DID",
    }),
    school: flags.string({
      char: "s",
      default: "Example School",
      description: "user's school",
    }),
  };
  async run() {
    const { flags } = this.parse(VCCommand);
    // console.log(flags);
    if (!flags.who) {
      console.error(`-w or --who is required with a users' DID`);
      process.exit(1);
    }

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
      const didipdid = "did:ipdid:" + fingerprint;
      //      console.log(`🐝🐝🐝 your DID is ${didipdid}  🐝🐝🐝`);

      did = {
        "@context": "https://w3id.org/did/v1",
        id: didipdid,
        publicKey: [
          {
            id: didipdid,
            type: keyPair.type,
            controller: didipdid, // issuer DID
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

      flags.today = new Date(Date.now()).toISOString();

      const omg = JSON.stringify(flags);
      const bytes = new TextEncoder("utf8").encode(omg);
      const hash = await multihashing(bytes, "sha2-256");
      const cid = new CID(1, "dag-pb", hash);

      const credential = {
        "@context": [
          "https://www.w3.org/2018/credentials/v1",
          "https://www.w3.org/2018/credentials/examples/v1",
        ],
        id: "did:ipdid:" + cid.toString(),
        type: ["VerifiableCredential", "AlumniCredential"],
        issuer: did.id, // issuer DI
        issuanceDate: new Date(Date.now()).toISOString(), //"2021-01-01T19:23:24Z",
        credentialSubject: {
          id: flags.who,
          alumniOf: flags.school,
        },
      };
      return credential;
    };

    jsonfile
      .readFile(filePath)
      .then(async (obj) => {
        // use old keyPair
        keyPair = await Ed25519VerificationKey2020.from(obj);

        let did = await getDID(keyPair);
        console.log(JSON.stringify(did));
        return did;
      })
      .catch(async (error) => {
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

VCCommand.description = `create a verifiable claim for a DID document
example, ipdid vc -w 'did:ipdid:z6MkiYiav3GskEZWgv2ZkeeFt8kWqnWRahv9d7pb8X2iEDEv'
...
return a claim DID for alumni of
`;

module.exports = VCCommand;
