#!/bin/bash
echo "BUILDING mono-neo-compiler";
(cd docker-compiler-csharp; ./docker_build.sh)

echo "BUILDING neo-boa-compiler";
(cd docker-compiler-python; ./docker_build.sh)

echo "BUILDING neo-go-compiler";
(cd docker-compiler-go; ./docker_build.sh)

echo "BUILDING neo-java-compiler";
(cd docker-compiler-java; ./docker_build.sh)

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
