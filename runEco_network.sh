#!/bin/bash
source .env

if (($NEO_SCAN)); then
	echo "RUNNING docker swarm with NEO-SCAN [4 neo-cli CN + 1RPC watchonly], [neoscan full & postgress]";
	(cd docker-compose-eco-network; docker-compose up -d eco-neo-csharp-node1-running eco-neo-csharp-node2-running eco-neo-csharp-node3-running eco-neo-csharp-node4-running eco-neo-csharp-noderpc1-running eco-neo-scan-full-running)
else
	echo "RUNNING minimal custom version [4 neo-cli CN + 1RPC watchonly]";
	(cd docker-compose-eco-network; docker-compose up -d eco-neo-csharp-node1-running eco-neo-csharp-node2-running eco-neo-csharp-node3-running eco-neo-csharp-node4-running eco-neo-csharp-noderpc1-running)
fi

