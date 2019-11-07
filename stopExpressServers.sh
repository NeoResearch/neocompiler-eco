#!/bin/bash
# Call script to stop HTTP server
echo "STOPPING docker-compose at docker-http-express";
(cd docker-http-express; docker-compose down)

echo "STOPPING docker-compose at docker-express-compilers";
(cd docker-express-compilers; docker-compose down)

#Eco Services
echo "STOPPING eco-services and compilers express";
(cd express-servers; ./stop-Compiler-EcoServices-Express-RPC.sh)
