#!/bin/bash
echo "BUILDING docker-compiler-privnet";
./docker_build.sh

echo "RUNNING  docker-compiler-privnet server (sponsored by NeoResearch)";
./docker_run.sh

echo "TRANSFERING initial funds (optional - commented)"
#TODO - Check this execTransfer - Kind of deprecated
docker exec -d -t neo-compiler-privnet-with-gas dash -i -c "./execTransferFundsAtTheBegin.sh"

echo "NeoCompiler.io private net complete, if you need to bash it, execute: docker exec -it neo-compiler-privnet-with-gas /bin/bash"
