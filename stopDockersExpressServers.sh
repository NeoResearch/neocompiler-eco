#!/bin/bash
echo "STOPPING docker compose at docker-http-express";
(cd docker-sock-express-compilers/docker-http-express; docker compose down)

echo "STOPPING docker compose at docker-sock-express-compilers/docker-compilers";
(cd docker-sock-express-compilers/docker-compilers; docker compose down)

echo "STOPPING docker compose at docker-sock-express-compilers/docker-services";
(cd docker-sock-express-compilers/docker-services; docker compose down)
