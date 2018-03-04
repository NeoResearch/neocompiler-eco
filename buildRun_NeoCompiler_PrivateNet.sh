#!/bin/bash
echo "BUILDING docker-compiler-privnet";
(cd docker-privnet; ./docker_build.sh)

echo "RUNNING  docker-compiler-privnet server (sponsored by NeoResearch)";
(cd docker-privnet; ./docker_run.sh)

echo "PRIVNET complete, if you need to bash it, execute: docker exec -it neo-compiler-privnet-with-gas /bin/bash"
