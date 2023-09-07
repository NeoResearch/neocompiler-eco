#!/bin/bash
echo "STOPPING docker compose at docker-http-express";
(cd ./docker-http-express; docker compose down -v)

echo "STOPPING docker compose at docker-sock-express-compilers/docker-compilers";
(cd ./docker-compilers; docker compose down -v)

echo "STOPPING docker compose at docker-sock-express-compilers/docker-services";
(cd ./docker-services; docker compose down -v)
