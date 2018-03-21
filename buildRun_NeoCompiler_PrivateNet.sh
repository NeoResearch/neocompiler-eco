#!/bin/bash
echo "BUILDING docker-compiler-privnet";
(cd docker-privnet; ./docker_build.sh)

echo "RUNNING  docker-compiler-privnet server (sponsored by NeoResearch)";
(cd docker-privnet; ./docker_run.sh)

echo "TRANSFERING initial funds (optional - commented)"
docker exec -d -t neo-compiler-privnet-with-gas dash -i -c "./execTransferFundsAtTheBegin.sh"

echo "NeoCompiler.io CityOfZion/PRIVATE-NET complete, if you need to bash it, execute: docker exec -it neo-compiler-privnet-with-gas /bin/bash"
