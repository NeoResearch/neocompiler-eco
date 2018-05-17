#!/bin/bash
CONTAINER_NAME="neo-compiler-neo-python"
echo "BUILDING docker-$CONTAINER_NAME";
./docker_build.sh

echo "RUNNING  docker-$CONTAINER_NAME server (sponsored by NeoResearch)";
./docker_run.sh

echo "TRANSFERING initial funds (optional - commented)"
#TODO - Check this execTransfer - Kind of deprecated
docker exec -d -t $CONTAINER_NAME dash -i -c "./execTransferFundsAtTheBegin.sh"

echo "NeoCompiler.io private net complete, if you need to bash it, execute: docker exec -it $CONTAINER_NAME /bin/bash"
