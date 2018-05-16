#!/bin/bash
echo "BUILDING mono-neo-compiler";
(cd docker-neo-mono; ./docker_build.sh)

echo "BUILDING neo-boa-compiler";
(cd docker-neo-boa; ./docker_build.sh)

echo "BUILDING neo-go-compiler";
(cd docker-neo-go; ./docker_build.sh)

echo "BUILDING neo-java-compiler";
(cd docker-java; ./docker_build.sh)

echo "STOPING server doors";
./stop.sh

echo "PRUNING any useless NPM dep";
npm prune

echo "INSTALLING with NPM";
npm install

echo "SLEEP 5 seconds. Waiting some couple of seconds until everything is processed...";
sleep 5

echo "RUNNING NeoCompiler Eco server (sponsored by NeoResearch)";
./run.sh
