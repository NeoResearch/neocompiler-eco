<p align="center">
    <img
      src="https://github.com/NeoResearch/neoresearch.github.io/blob/master/assets/images/logo/Gemcut-butterfly/butterfly-banner.png"
       />
</p>


## NeoCompiler Eco 3+

<p align="center">
    <img
      src="./public/images/logo_neoresearch.png"
      width="125px;" />
    <img
      src="./public/images/prototype-icon-eco.png"
      width="125px;" />
</p>

This is an open-source initiative for providing an easy access to on NEO ecosystem.

In particular, we provide simple interact and didactic interfaces for allowing online compiling for C#, Python, Go and Java.

**Official Documentation on [ReadTheDocs](https://neocompiler-eco.readthedocs.io)**

[![Documentation Status](https://readthedocs.org/projects/neocompiler-eco/badge/?version=latest)](https://neocompiler-eco.readthedocs.io/en/latest/?badge=latest)

#### Building Sphinx Documentation Locally

Just type `./make-docs.sh`, and find `./docs/build/html/index.html` (the same as *ReadTheDocs*)

### Suggestions

#### Browsers/Devices

* Tested with Firefox Quantum - 76.0.1
* Tested with Chromium - Version 73

#####  The current front-end interface can be acessed from:
* [https://neocompiler.io](https://neocompiler.io), automatically generated from the source code located in this current repository.

##### Compilers RPC API services are available at:

* [https://compilers.neocompiler.io/](https://compilers.neocompiler.io)

##### Other useful services

* [https://ecoservices.neocompiler.io](https://ecoservices.neocompiler.io)
* C# RPC node with watch-only CN feature;

### What does it currently do
* Compile input C# code using reliable and safe servers (backend) compilers;
* Return NEF compatible files: AVM, ABI and MANIFEST codes;
* Deploy and invoke code to private net, shared privatenet, testnet (unsafe), mainet (unsafe);
* Save your history of activies for testing a given smart contract;
* Tests with different wallets, synced and with able to provide historic data our activity;
* Perform all up-to-date blockchain invocations and RPC calls;
* Runs RPC with all enabled plugins and up-to-date features;
* Provide basic statistical data;
* Use websockets to provide some useful information;
* It can be used on TestNet, or even MainNet (however, this is extremely not recommended).
* Integrate with `neologin`/`O3wallet`/`neolink` project (or any other), to allow secure key management for Test/MainNet ((previously tested on NeoCompiler Eco for NEO master-2x only - Waiting for third-party updates on NEO 3x).

### Roadmap

* Move towards client-based compiling (more secure, robust and much more scalable).
* Ideas? Collaborations are welcome :) The goal is to be didactic and bring it close to citizens and users: Smart Cities, Smart Governance and Smart Blockchain Technologies :P

### Dependencies

### Installing docker-compose 1.19.0+

We need docker-compose version 1.23.1 (or more), so we recommend the following steps for installation:

* Ubuntu-based distributions [guidelines](https://docs.docker.com/compose/install/#install-compose):

```docker
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

`chmod +x /usr/local/bin/docker-compose`

`echo "export PATH=\$PATH:/usr/local/bin/" >> ~/.bashrc`

`source ~/.bashrc`

### Docker recommendations

Docker technology is essential for sandboxing all compilers in different environments (for different languages).

We DO NOT recommend packages docker.io/docker-engine: `sudo apt purge docker docker-engine docker.io`.

* Ubuntu-based distributions [guidelines](https://docs.docker.com/install/linux/docker-ce/ubuntu/#set-up-the-repository):

`sudo apt-get install apt-transport-https ca-certificates curl software-properties-common gnupg2`

`curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -`

`sudo apt-key fingerprint 0EBFCD88`

`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"`

`sudo apt update`

`sudo apt install docker-ce`

* Deepin users can follow Ubuntu instructions and use `bionic` (Ubuntu 18.04) repository:
`sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"`
- `sudo apt install apparmor=2.12-4ubuntu5` (the official `2.12-4` version was denying network access to docker)

Adding user to docker group: `sudo usermod -a -G docker $USER`

# Build everything

The online command required to create our own NeoCompiler Ecosystem, suitable for private of public blockchain projects.

This will call a docker-compose with NeoCompiler Private Net (Eco) + NeoScan (optional).
Furthermore, it will set all available compilers and open the front/backend interface and server, respectively.

`./build_everything.sh`

# Developers guidelines

Basically, two steps are required: A1 and A2.
Both are described below.

## A1) Building compilers

This script already builds the compilers and starts the server:

`./buildCompilers.sh`

* Build list with different versions for a given compiler, such as: `docker-sock-express-compilers/docker-compilers/compilers/docker-compiler-csharp/docker_build_list_of_compilers.sh`

* Please note that in the first build the `./buildCompilers.sh` will execute in parallel as a `screen` on the container, then, you may need to wait until the building process if finished. You can easily check the checkly by using `screen -d`

#### Building C# Neo Core Compiler entrypoint based image

The backend for C# is provided using native `github/neo-project` tools, only two steps are necessary to build and tag image:

`cd /docker-sock-express-compilers/docker-compilers/compilers/docker-compiler-csharp`

`docker_build.sh`

### Running express node servers

**Http front-end**:
`cd docker-http-express`

`docker_build.sh`

`docker-compose up`

**Compilers RPC API Backend**:
`docker-sock-express-compilers/docker-compilers`

`docker-compose up`

**Eco Services**:
`docker-sock-express-compilers/docker-services`

`docker-compose up`

**Base images for both previously mentioned services**

`docker-sock-express-compilers/docker-ubuntu-docker-node-express`

`./docker_build.sh`


## A2) Eco Network Funtionalities

Docker-compose is the main tools that acts for the creation of our micro-service.

This script will start all necessary backend functionalities and neo-csharp-nodes (optional parameter can be modified on `.env`).

In particular, we currently have:

* csharp nodes are with TCP at 2033x and RPC at 3033X, websocket is not being used
  * 4 csharp consensus node, two of them are also a RPC as default at port 30333 and 30334;
  * 1 csharp pure RPC nodes at 30337;
* optional [neoscan](https://github.com/CityOfZion/neo-scan) full (with images obtained at [https://gitlab.com/CityOfZion/neo-scan/container_registry](https://gitlab.com/CityOfZion/neo-scan/container_registry): neoscan-full and postgress container;

### Dealing with docker-compose swarm of containers

Start up the container, checking the messages and following warnings

Simply run `runEco_network.sh` (integrated with `.env` file)

or:

`cd ./docker-compose-eco-network`

```
docker-compose up
```

Start up the container in a detached mode
```
docker-compose up -d
```

Feel free to take is down
```
docker-compose down
```

However, consider stopping and restarting
```
docker-compose stop
docker-compose start
```

### NeoCompiler Eco useful commands and ideas

#### Other functionalities and integrations are possible and some are implemented

It is also possible to integrate the Eco Network with lighwallet and explorers.

#### Other parameters

One could check docker docker-compose.yml, picking up a combination of your choice from `docker-compose-eco-network` folder.
This can be done for locally modifying some characteristics.

Run `build_everything.sh` with an additional parameter `--no-build` and your modified node `zip` of the private net will be called, use the name `neo-cli-built.zip`.


#### Useful Commands

# open csharpnodes

* `docker exec -it eco-neo-csharp-node1-running bash`
* `screen -dr` will show the screen
* `/opt/run.sh` will start a new screen (if you killed the last process);
* `/opt/start_node.sh` will start the node directly in the terminal.


## Contributing

* If you have ideas or issues, you can inform directly at github or contact us directly

  1. Check the open [issues](https://github.com/NeoResearch/neocompiler-eco/issues) and
[pull requests](https://github.com/NeoResearch/neocompiler-eco/pulls) for existing discussions.
  1. Open an issue first, to discuss a new feature or enhancement.
  1. Write tests, and make sure the test suite passes locally and on CI.
  1. Open a pull request, and reference the relevant issue(s).
  1. After receiving feedback, squash your commits and add a great commit message.
  1. Run `make push-tag` after merging your pull request.
  1. Anyway, you already were part of team... :P

* Our team is currently formed by researchers/professors, so our time is very constrained... if you feel you can help us, don't hesitate!
* We created a wallet specially for project donations. That can help us improve our servers and perhaps hire someone for improving graphical interfaces and developing many more interesting features. NEO wallet:
__AJX1jGfj3qPBbpAKjY527nPbnrnvSx9nCg__


**LICENSE MIT**

This project is part of NeoResearch initiative and it is freely available at [NeoCompiler.io](https://neocompiler.io).
The website is rebooted periodically, in order to keep resource usage low, so that everyone is welcome to use it.

*NeoCompiler Eco team* [@igormcoelho](https://github.com/igormcoelho) and [@vncoelho](https://github.com/vncoelho)

Copyleft 2017-2019
