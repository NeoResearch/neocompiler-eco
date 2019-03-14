#!/bin/bash
source .env

if (($NEO_SCAN)); then
	echo "STOPPING docker swarm with NEO-SCAN";
	(cd docker-compose-eco-network; docker-compose -f docker-compose-neoscan.yml up -d)
else
	echo "STOPPING minimal custom version";
	(cd docker-compose-eco-network; docker-compose up -d)
fi

