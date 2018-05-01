<p align="center">
    <img
      src="./public/images/logo.png"
      width="125px;">
      <img
        src="./public/images/prototype-icon-eco.png"
        width="125px;">
</p>

## NeoCompiler Eco

This is an open-source initiative for providing an easy access to on NEO ecosystem.

In particular, we provide simple interact and didactic interfaces for allowing online compiling.
In the first moment, we started with C# and Python.
Our next steps are moving us towards Java and Solidity (through NeoSol initiative).

### What does it currently do
* Compile input C#, Python or Go code using reliable and safe servers (backend) compilers;
* Return AVM and ABI codes (more precise of C# compiler);
* Deploy and invoke code to private net (Current in the back);
* Tests with different wallets, synced and with able to provide historic data our activity.

### Next steps
* Integrate with testnet invokes
* Integrate with Java
* Integrate with neo-solidity (project in early phases);
* Move towards client-based compiling (more secure, robust and much more scalable).
    - Some efforts have been done here already, but many technical challenges are still being dealt with;
    - It has not been easy, still, to accomplish all necessary invocatations only in the client side. On the other hand, the server has been responding smooth and nice, providing a nice didactic infrastructure to be used by professors, researchers and those intesred on Neo's multi-language programming interface.
* Ideas? Collaborations are welcome :) The goal is to be didactic and bring it close to citizens and users: Smart Cities, Smart Governance and Smart Blockchain Technologies :P

### Dependencies

For Debian-based systems:

`apt install npm`

`apt install nodejs-legacy`

`npm install`

# Build everything

The online command required to create our own NeoCompiler Ecosystem, suitable for private of public blockchain projects.

This will call a docker-compose with NeoCompiler Private Net+NeoScan.
Furthermore, it will set all available compilers and open the front/backend interface and server, respectively.

`./build_everything.sh`

# Developers guidelines

## Building compiling backends (C#, Python and Go)

Docker technology is essential for sandboxing all compilers in different environments (for different languages).
For Ubuntu releases, we recommend package docker.io: `# apt install docker.io`.

### Building docker-neo-mono backend
The backend for C# is provided by mono, only two steps are necessary to build and tag image `docker-mono-neo-compiler`:

`cd docker-neo-mono`

`docker_build.sh`

### Building docker-neo-boa backend
The backend for Python is provided by neo-boa compiler, only two steps are necessary to build and tag image `docker-neo-boa`:

`cd docker-neo-boa`

`docker_build.sh`

### Building docker-neo-go backend
The backend for Go is provided by neo-go team, only two steps are necessary to build and tag image `docker-neo-go`:

`cd docker-neo-go`

`docker_build.sh`


## Running node server

After building the compilers (without privatenet) you can run the front/backend node server (at port 8000 by default):

`./run.sh`

### Building and running node server

This script already builds the compilers and starts the server:

`./buildRun_WebInterface_CSharpCompiler`

## Alone and solitary private net backend: Building and running private net server

In order to use deploy and invoke (also testinvoke, if you want to quicker on your verifications) functionalities, build and run a docker private (namely, docker-privanet).

`(cd docker-privnet; ./buildRun_NeoCompiler_PrivateNet.sh)`

## Privanet backend with NeoScan lightwallet funtionalities

In order to add NeoScan `light wallet` (more is comming...) functionalities, run docker-compose.

### Installing docker-compose 1.19.0+

We need docker-compose version 1.19.0 (or more), so we recommend the following steps for installation:

`curl -L https://github.com/docker/compose/releases/download/1.19.0/docker-compose-``uname -s``-``uname -m`` -o` `/usr/local/bin/docker-compose`
`chmod +x /usr/local/bin/docker-compose`
`echo "export PATH=\$PATH:/usr/local/bin/" >> ~/.bashrc`
`source ~/.bashrc`

### Starting the privatenet container

Start up the container, checking the messages and following warnings

`cd ./javascript-tools/docker-neo-scan`

```
docker-compose up
```

Start up the container in a detached mode
```
docker-compose up -d
```

Fell free to take is down
```
docker-compose down
```

However, consider stopping and restarting
```
docker-compose stop
docker-compose start
```

Or, simply run:

```
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh stop)
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh start)
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh down)
```
### Other functionalities and integrations are possible and some are implemented

Check out Neo-Scan + Neon-Db, for instance.



## NeoCompiler dockers tips

Nowadays, you should check docker docker-compose.yml (pick up a combination of your choice, from `dockers-neo-scan-neon` folder, for locally modifying some characteristic of NeoCompiler.

Run `build_everything.sh` with an additional parameter (any of your choice) is going to build/call your modified files of the private net (i.e. call `(cd docker-privnet; ./buildRun_NeoCompiler_PrivateNet.sh)`).

After that, considering your modified `docker_build.sh` you gonna be able to modify the aforementioned docker-compose. Then, any modification that is felt to be good should be communicated as an Issue or Pull Request.

## Other functionalities and integrations are possible and some are implemented

Check out Neo-Scan + Neon-Db, for instance.

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


LICENSE MIT


This project is part of NeoResearch initiative and it is freely available at [NeoCompiler.io](https://neocompiler.io).
The website is rebooted periodically, in order to keep resource usage low, so that everyone is welcome to use it.
Questions regarding the webserver may be directed to [@igormcoelho](https://github.com/igormcoelho) and [@vncoelho](https://github.com/vncoelho).

*NeoCompiler Eco team* [@igormcoelho](https://github.com/igormcoelho),[@vncoelho](https://github.com/vncoelho) and [@FabioRick](https://github.com/FabioRick)

Copyleft 2017-2018
