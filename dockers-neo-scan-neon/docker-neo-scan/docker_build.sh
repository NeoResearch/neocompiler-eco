#!/bin/bash
CONTAINER_NAME="neo-compiler-neoscan"
#docker build . --build-arg SHA=$(curl -s 'https://api.github.com/repos/CityOfZion/neo-scan/commits' | grep sha | head -1) -t $CONTAINER_NAME

docker build -t $CONTAINER_NAME docker build -t $CONTAINER_NAME . --build-arg SHA=$(curl -s 'https://api.github.com/repos/CityOfZion/neo-scan/commits' | grep sha | head -1) . 
