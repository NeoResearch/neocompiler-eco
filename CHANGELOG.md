# Changelog
Welcome to NeoCompiler Eco project. This project is fully developed by the community using MIT License, so feel free to contribute with coding or even with good ideas or indication of bugs/issues. It is intended to included all compiling and testing support for developing smart contracts on NEO blockchain. We will hold an online version on neocompiler.io website, but you can also have it in your computer! We hope it's useful and we accept donations if you really enjoy it :)

### Versioning Guidelines
The idea is to follow the semantic versioning format for the releases (MAJOR-MINOR-FIX).
- The MAJOR will be attributed to major changes in interface (when the main concept is somehow changed) or main changes in the backend technologies (which may cause bigger incompatibility issues)
- The MINOR will be updated on improvements and new features (may cause some small incompatibilities, but the idea is to be fully compatible)
- The FIX number will be used when specific fixes are made on a previously launched release (but we intend to keep moving on the mainline, so do not be too much left behind :D)

### Release information
Current development version is 4.0, so a new major version is coming out with very good things :) The directions we are following now are:
- More embedded examples for all supported programming languages
- Full integration with neon-opt project (when it's ready), so compiled AVM will be automatically optimized
- Full integration with neon-sim project (when it's ready), so the invocations could be made locally on the web client simulator. That will bring more information on possible "fault" situations, with instant results on screen.

### [3.5.0] - 2019-06-06
- improving automatic claim mechanism for deploy and invoke
- simplifying neo-scan for a single full container
- improving ability to reset server via front-end
- replay activity is almost working 100%!
- added counters to decompiler

### [3.4.0 - 3.1.0] - 2019-04-15
- adding support for advanced signing (an `InvocationTx` transaction can be easily invoked from multiple addresses, for example: a single address + multisg + contract + verification with a single interface)
- smart contracts can be saved in local storage, persisting user session (use with caution, contract might be lost!)
- support for UTXO and GAS claims via neo-cli
- ABI files can be loaded on the invoke page (useful feature when neocompiler eco service is used for testing smart contracts)
- added initial support for saving historical activity and reload it - transactions can be replicated just by clicking in the activity table
- incremental storage tab (storage changes can be easily tracked)
- support for automatic selection of best back-end for compiling smart contracts
- support for automatic selection of best neo-cli RPC node
- deprecated neo-python for neo-scan and from `docker compose`
- improved addresses management with simple buttons for adding compiled contract or contracts from verification scripts
- statistical tool for generating graphs about block timestamps
- support for modifying consensus default time per block via front-end
- support for modifying reset reserver via front-end
- adding tx size info after compiling and automatic network fee based on this size (if exceed max. limit)
- angular routes for ecolab tabs
- distinct minor front-end performance improvements
- for the first time, code has been a little bit indented


### [3.0] - 2019-03-11
- adding support for multi version compilers
- adding support for multisig send and claim via javascript, using some tools from NeonJS 3.10.0
- deprecated genesis block via neo-python and replaced by javascript multi-sig transfer from genesis block
- created a webchat on gitter
- separating neo-cli nodes in different containers
- updated npm to 6.3.0
- adding support to codemirror
- deprecated invoke via neo-python

### [2.3.2] - 2018-08-04
- converter from javascript int to big endian byte array
- fixes in getstorage box
- assuming canonical format (string + object[]) when importing contracts
- automatically filling scripthash when importing contracts
- fixed readonly invoke (for imported contracts)
- pretty json on RPC output box

### [2.3.1] - 2018-08-02
- fixes in wallet support (when adding new wallets)

### [2.3] - 2018-08-02
- created option box for neon-opt (still alpha)
- official support for invokes with neon-js
- support for negative integers in neon-js operations
- updated neoscan to master
- added more C# examples
- using --compatible mode on C# compiler (without NEP8)

### [2.2] - 2018-07-23
- added frontend support at GitHub Pages: neocompiler-eco.neoresearch.io
- dealing with same-origin policy

### [2.1.1] - 2018-07-23
- updated neonscan to top version on master
- updated neon-js to 3.9.2
- updated neo-python to 0.7.5
- updated neo-cli to 2.7.6.1
- testing neon-js invoke feature
- deprecated neo-python deploy support
- updating all docker images to ubuntu 18.04

### [2.1.0-beta] - 2018-06-24
- improvements on neon-js invoke option
- deploy function working on neon-js
- update neon-js to 3.9.0

### [2.0.1-beta] - 2018-06-18
- improvements on wallet tab layout
- improvements on execution scripts
- using sockets to update header information on real time

### [2.0-beta] - 2018-06-16
- many fixes in interface
- ignore connections.json
- added alpha of neon-opt project
- update android to 1.5

### [1.5] - 2018-06-14
- using simple arrow for automatic claims
- added CoZ testnet
- update neon compiler to 2.0.3.7
- update neo-python to 0.7.1
- ability to sign transactions on web client
- many fixes on python prompt
- update neo-python to 0.7.0
- update neon-js to 3.8.1
- box to get nep5 information

### [1.4] - 2018-05-25
- get notification logs from neo-python
- displaying neo-cli, neoscan and neopy-rest block counts
- update android to 1.3.1

### [1.3.1] - 2018-05-24
- cleaning useless data on screen
- fixes on file permissions
- fixes on wallet table

### [1.3] - 2018-05-23
- automatically fill private key on boxes for registered addresses
- automatically claim gas on wallet
- improved neoscan dockers

### [1.2.2] - 2018-05-22
- displaying logs from each consensus node in privatenet
- removing workarounds from neo-python integration (finally!!!)

### [1.2] - 2018-05-20
- better organization of backend
- neo-cli updated to 2.7.4
- separation of neo-python and neo-cli
- GAS claim support in wallet section

### [1.1] - 2018-05-17
- too many improvements on interface :)
- Invoke/verification utxo tool
- RPC tool
- wallet support (displaying WIF and allowing to add new addresses)
- Added Go compiler
- AVM import tool
- Changed: Neo csharp nodes and neo-python decentralized in different dockers. It was confuse for everyone. Still not in web.
- Changed: Neo-scan updated
- Added: Several new Util features, transactions for NEP 10 and 11.
- Added: Java compiler
- Added: Neo-opt-tests merged inside the ecosystem, as well as the first netoork competition.


### [1.0] - 2018-04-10
- In partnership with NeoResearch team, NeoCompiler Eco releases it stable v1.0 version.
- Android APK, compiled with Phonegap, can also be download from the website or https://gist.github.com/vncoelho/af931ab9d99b711ef1cb53b1d2f3f464/raw/e8bc602ef62a3b5a0b39be0444f274cc70aa6e29/NeoCompilerEco-v1.0.apk.
- The current Ecosystem is running with a modified version of cityofzion/neo-privatenet:2.7.3, here taged as neo-compiler-privnet-with-gas:2.7.3.
- The neo-scan is the one that can be founded in the dockers-neo-scan-neon/docker-neo-scan folder, building it there and waiting the first syncronizing steps.
- Thus, a boostrap image was also commited to a hub.docker repository.

### [0.9] - 2018-04-01
- avm decompilation support
- base58 converters
- using ace editor


### [0.5] - 2018-03-21
- updated neo-cli to 2.7.3
- welcome page created
- hex code tips

### [0.2] - 2018-03-04
- asyncronous docker invocations
- improved interface

### [0.1-alpha] - 2018-03-04
- Limited privatenet support
- Improved compiling support to C# and Python (neo-boa)

### [0.1-prealpha] - 2018-01-19
- Support for C# compiler
- Project registered at GitHub

### [0.0] - 2017-12-25
- Project is born


NeoResearch 2017-2019

MIT License
