#!/bin/bash
echo "BUILDING docker-compiler-privnet";
(cd docker-privnet; ./docker_build.sh)

echo "RUNNING  docker-compiler-privnet server (sponsored by NeoResearch)";
(cd docker-privnet; ./run-priv.sh)

#export DOCKERPRIV=$((cd docker-privnet; docker build . | tail -n 1 ) | awk 'NR==1{print $3}')



