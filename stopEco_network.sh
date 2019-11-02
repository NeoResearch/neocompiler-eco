#!/bin/bash
source .env

function usage {
    echo "Usage: $0 [--stop-express]"
}

STOP_EXPRESS=0

while [[ "$#" > 0 ]]; do case $1 in
    -h)
        usage
        exit 0
        ;;
    --stop-express)
        STOP_EXPRESS=1
        shift
        ;;
    --all)
        STOP_EXPRESS=1
        shift
        ;;
    *)
        usage
        exit 1
        ;;
  esac;
done

# Setting all container in the docker-compose-eco-network folder down for avoiding leaving containers running after changing enviroment parameters

if (($NEO_SCAN)); then
	echo "STOPPING docker swarm with NEO-SCAN";
	(cd docker-compose-eco-network; docker-compose down)
else
	echo "STOPPING minimal custom version";
	(cd docker-compose-eco-network; docker-compose down)
fi

if (($STOP_EXPRESS)); then
	echo "STOPPING compilers, ecoservices and http";
	./stopExpressServers.sh
fi
