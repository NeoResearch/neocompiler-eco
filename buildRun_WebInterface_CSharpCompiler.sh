#!/bin/bash
echo "BUILDING mono-neo-compiler";
(cd docker-neo-mono; ./docker_build.sh)

echo "BUILDING neo-boa-compiler";
(cd docker-neo-boa; ./docker_build.sh)

echo "BUILDING neo-go-compiler";
(cd docker-neo-go; ./docker_build.sh)

#export DOCKERNEOCOMPILER=$((cd docker-neo-mono; docker build -t docker-mono-neo-compiler . | tail -n 1 ) | awk 'NR==1{print $3}')

export DOCKERNEOCOMPILER=$(docker images -aq "docker-mono-neo-compiler")

echo "STOPING server doors";
./stop.sh

echo "SLEEP 5 seconds. Waiting some couple of seconds until everything is processed...";
sleep 5

echo "RUNNING NeoCompiler.io server (sponsored by NeoResearch)";
./run.sh
