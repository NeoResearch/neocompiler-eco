#!/bin/bash
source .env

# Setting all container in the docker-compose-eco-network folder down for avoiding leaving containers running after changing enviroment parameters

if (($NEO_SCAN)); then
	echo "STOPPING docker swarm with NEO-SCAN";
	(cd docker-compose-eco-network; docker-compose down)
else
	echo "STOPPING minimal custom version";
	(cd docker-compose-eco-network; docker-compose down)
fi
