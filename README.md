ipdid
=====

The IPDID ecosystem

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/ipdid.svg)](https://npmjs.org/package/ipdid)
[![Downloads/week](https://img.shields.io/npm/dw/ipdid.svg)](https://npmjs.org/package/ipdid)
[![License](https://img.shields.io/npm/l/ipdid.svg)](https://github.com/mingderwang/ipdid/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ipdid
$ ipdid COMMAND
running command...
$ ipdid (-v|--version|version)
ipdid/0.1.0 darwin-arm64 node-v16.0.0
$ ipdid --help [COMMAND]
USAGE
  $ ipdid COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ipdid did`](#ipdid-did)
* [`ipdid help [COMMAND]`](#ipdid-help-command)
* [`ipdid init`](#ipdid-init)
* [`ipdid mydid`](#ipdid-mydid)
* [`ipdid qrcode`](#ipdid-qrcode)
* [`ipdid signer`](#ipdid-signer)
* [`ipdid vc`](#ipdid-vc)

## `ipdid did`

register a PDID to SKALE network and IPFS (IPLD) - use pipe only

```
USAGE
  $ ipdid did

OPTIONS
  -d, --ddoc=ddoc  DID document
  -f, --force      force to register on ipfs block

DESCRIPTION
  ...
  you can pipe any DID document to generate and register a DID
```

_See code: [src/commands/did.js](https://github.com/mingderwang/ipdid/blob/v0.1.0/src/commands/did.js)_

## `ipdid help [COMMAND]`

display help for ipdid

```
USAGE
  $ ipdid help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.2/src/commands/help.ts)_

## `ipdid init`

create a new IPDID ipfs (deprecated)

```
USAGE
  $ ipdid init

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  don't use this init command any more.
```

_See code: [src/commands/init.js](https://github.com/mingderwang/ipdid/blob/v0.1.0/src/commands/init.js)_

## `ipdid mydid`

return your current DID

```
USAGE
  $ ipdid mydid

OPTIONS
  -q, --qrcode  generate and show DID QR code (default: false)

DESCRIPTION
  ...
  show your current DID code
```

_See code: [src/commands/mydid.js](https://github.com/mingderwang/ipdid/blob/v0.1.0/src/commands/mydid.js)_

## `ipdid qrcode`

to generate a QR-code from your context or stdin

```
USAGE
  $ ipdid qrcode

OPTIONS
  -c, --context=context  the context for generating a QR-code

DESCRIPTION
  ...
  --context string (default for testing: '0x8587eA108898749538372Cd3Df459870C4a1A56F')
```

_See code: [src/commands/qrcode.js](https://github.com/mingderwang/ipdid/blob/v0.1.0/src/commands/qrcode.js)_

## `ipdid signer`

create a singer's key pair and save on ~/.ipdid_keystore.json

```
USAGE
  $ ipdid signer

OPTIONS
  --help  show CLI help

DESCRIPTION
  ...
  return your DID for signer if ~/.ipdid_keystore.json exist
  otherwise, create a new one.
```

_See code: [src/commands/signer.js](https://github.com/mingderwang/ipdid/blob/v0.1.0/src/commands/signer.js)_

## `ipdid vc`

create a verifiable claim for a DID document

```
USAGE
  $ ipdid vc

OPTIONS
  -s, --school=school  [default: Example School] user's school
  -w, --who=who        user's DID

DESCRIPTION
  example, ipdid vc -w 'did:ipdid:z6MkiYiav3GskEZWgv2ZkeeFt8kWqnWRahv9d7pb8X2iEDEv'
  ...
  return a claim DID for alumni of
```

_See code: [src/commands/vc.js](https://github.com/mingderwang/ipdid/blob/v0.1.0/src/commands/vc.js)_
<!-- commandsstop -->
