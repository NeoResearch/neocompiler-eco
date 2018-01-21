NeoCompiler.io

This is an open-source initiative for providing an easy access to NEO compilers.

We will start with CSharp, Python (through neo-boa) and Solidity (through neo-solidity initiative).

How to install: 
apt install npm
apt install nodejs-legacy

Build the docker-neo backend:
cd docker-neo
docker build .

Get the docker image id (example ab123456) and set environment variable:
export DOCKERNEOCOMPILER=ab123456

Run node server:
./run.sh

LICENSE MIT

Copyleft 2017-2018

Igor and Vitor Coelho
