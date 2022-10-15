#!/bin/bash
echo "RUNNING minimal custom version [4 neo-cli CN + 1RPC watchonly + autoheal]";
(cd docker-compose-eco-network; docker compose up -d eco-neo-csharp-node1-running eco-neo-csharp-node2-running eco-neo-csharp-node3-running eco-neo-csharp-node4-running eco-neo-csharp-noderpc1-running eco-neo-autoheal)

