#!/bin/bash
echo "BUILDING mono-neo-compiler";
(cd docker-neo; ./docker_build.sh)

echo "BUILDING neo-boa-compiler";
(cd docker-neo-boa; ./docker_build.sh)

#export DOCKERNEOCOMPILER=$((cd docker-neo; docker build -t docker-mono-neo-compiler . | tail -n 1 ) | awk 'NR==1{print $3}')

export DOCKERNEOCOMPILER=$(docker images -aq "docker-mono-neo-compiler")

echo "RUNNING NeoCompiler.io server (sponsored by NeoResearch)";
./run.sh
