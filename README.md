<p align="center">
    <img
      src="http://res.cloudinary.com/dnh3we6el/image/upload/v1519941321/NeoResearch-Logo.png"
      width="125px;">
</p>

## NeoCompiler.io

This is an open-source initiative for providing an easy access to NEO compilers.

*This is still an alpha project with focus on incentiving and disseminating NEO smart contract programming. If you really want to deploy the smart contract on NEO network, make sure you check the AVM with external compilers.*

We will start with C#, Python (through neo-boa), Java and Solidity (through neo-solidity initiative).

### What does it currently do
* Compile input C# code using backend compiler;
* Return AVM and ABI codes;
* Deploy code to private net;
* Contract invoke;
* Tests with different wallets.

### Next steps
* Integrate with Python compiler (neo-boa);
* Integrate with neo-solidity (project in early phases);
* Move towards client-based compiling (more secure, robust and much more scalable). Some efforts have been done here already, but many technical challenges are still being dealt with;
* Integrate with javascript compiler (as soon as it is available);
* Ideas? Collaborations are welcome :)

### Dependencies

For Debian-based systems:

`apt install npm`

`apt install nodejs-legacy`

`npm install`

## Docker-neo csharp compiler backend

### Building docker-neo backend

`cd docker-neo`

`docker build .`

Get latest docker image id and set environment variable:

`export DOCKERNEOCOMPILER=$(docker images | awk 'NR==2{print $3}')`

### Running node server

`./run.sh`

### Building and running node server

`./buildRun_WebInterface_CSharpCompiler`

## Privanet backend

### Building and running privnet server

In order to use deploy and testinvoke functionalities, build and run docker-privanet.

`./buildRun_NeoCompiler_PrivateNet`

## Privanet backend with NeoScan lightwallet funtionalities

### Building and running privnet server

In order to add NeoScan light wallet functionalities, run docker-compose.


Start up the container, checking the messages and following warnings

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
buildRun_Compose_PrivateNet_NeoScanDocker.sh
buildRun_Compose_PrivateNet_NeoScanDocker.sh stop
buildRun_Compose_PrivateNet_NeoScanDocker.sh start
buildRun_Compose_PrivateNet_NeoScanDocker.sh down
```


## Contributing

* If you have ideas or issues, you can inform directly at github or contact us directly
* Our team is currently formed by researchers/professors, so our time is very constrained... if you feel you can help us, don't hesitate!
* We created a wallet specially for project donations. That can help us improve our servers and perhaps hire someone for improving graphical interfaces and developing many more interesting features. NEO wallet:
__AJX1jGfj3qPBbpAKjY527nPbnrnvSx9nCg__


LICENSE MIT

*NeoCompiler.io team* (part of NeoResearch team)

Original authors: [@igormcoelho](https://github.com/igormcoelho) and [@vncoelho](https://github.com/vncoelho)

Copyleft 2017-2018
