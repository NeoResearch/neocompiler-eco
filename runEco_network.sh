#!/bin/bash
source .env

if (($NEO_SCAN)); then
	echo "RUNNING docker swarm with NEO-SCAN";
	(cd docker-compose-eco-network; docker-compose up -d eco-neo-csharp-node1-running eco-neo-csharp-node2-running eco-neo-csharp-node3-running eco-neo-csharp-node4-running eco-neo-csharp-noderpc1-running eco-neo-scan-api-running eco-neo-scan-sync-running)
else
	echo "RUNNING minimal custom version";
	(cd docker-compose-eco-network; docker-compose up -d eco-neo-csharp-node1-running eco-neo-csharp-node2-running eco-neo-csharp-node3-running eco-neo-csharp-node4-running eco-neo-csharp-noderpc1-running)
fi

