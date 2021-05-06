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
ipdid/0.0.5 darwin-arm64 node-v16.0.0
$ ipdid --help [COMMAND]
USAGE
  $ ipdid COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ipdid daemon`](#ipdid-daemon)
* [`ipdid did`](#ipdid-did)
* [`ipdid help [COMMAND]`](#ipdid-help-command)
* [`ipdid id`](#ipdid-id)
* [`ipdid init`](#ipdid-init)
* [`ipdid key`](#ipdid-key)
* [`ipdid signer`](#ipdid-signer)
* [`ipdid vc`](#ipdid-vc)

## `ipdid daemon`

start a IPDID node as daemon

```
USAGE
  $ ipdid daemon

OPTIONS
  -l, --log=log  show logs

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/daemon.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/daemon.js)_

## `ipdid did`

```
USAGE
  $ ipdid did

OPTIONS
  -d, --ddoc=ddoc  DID document
  -f, --force      force to register on ipfs block
```

_See code: [src/commands/did.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/did.js)_

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

## `ipdid id`

show your DID

```
USAGE
  $ ipdid id

OPTIONS
  -d, --dir=dir  [default: /Users/mingderwang/src/20210426-ipdid]
  --help         show CLI help
  --version      show CLI version

DESCRIPTION
  ...
  show your DID in details
```

_See code: [src/commands/id.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/id.js)_

## `ipdid init`

create a new IPDID ipfs

```
USAGE
  $ ipdid init

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/init.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/init.js)_

## `ipdid key`

show your DID key pair

```
USAGE
  $ ipdid key

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  --long format
```

_See code: [src/commands/key.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/key.js)_

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

_See code: [src/commands/signer.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/signer.js)_

## `ipdid vc`

create a verifiable claim for a did

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

_See code: [src/commands/vc.js](https://github.com/mingderwang/ipdid/blob/v0.0.5/src/commands/vc.js)_
<!-- commandsstop -->
