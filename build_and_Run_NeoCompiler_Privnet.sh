#!/bin/bash
echo "BUILDING docker-compiler-privnet";
(cd docker-privnet; ./docker_build.sh)

echo "RUNNING  docker-compiler-privnet server (sponsored by NeoResearch)";
(cd docker-privnet; ./run-priv.sh)

echo "TRANSFERING initial funds"
docker exec -t neo-compiler-privnet-with-gas dash -i -c "./exectransferfundsAtTheBegin.sh" > saidafunds.log

echo "PRIVNET complete, if you need to bash it, execute: docker exec -it neo-compiler-privnet-with-gas /bin/bash"

#export DOCKERPRIV=$((cd docker-privnet; docker build . | tail -n 1 ) | awk 'NR==1{print $3}')



