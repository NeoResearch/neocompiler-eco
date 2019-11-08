#!/bin/bash
source .env

function usage {
    echo "Usage: $0 [--cancel-stop-docker-express]"
}

STOP_EXPRESS=1

while [[ "$#" > 0 ]]; do case $1 in
    -h)
        usage
        exit 0
        ;;
    --cancel-stop-docker-express)
        STOP_EXPRESS=0
        shift
        ;;
    *)
        usage
        exit 1
        ;;
  esac;
done

# Setting all container in the docker-compose-eco-network folder down for avoiding leaving containers running after changing enviroment parameters

echo "STOPPING all network related services";
(cd docker-compose-eco-network; docker-compose down)


if (($STOP_EXPRESS)); then
	echo "(DEFAULT) STOPPING all docker with express services: compilers, ecoservices and front-end-http";
	./stopDockersExpressServers.sh
fi
