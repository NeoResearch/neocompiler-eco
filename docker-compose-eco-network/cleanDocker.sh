#!/bin/bash
# Stop and Delete all docker images
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)

# Clean all none images
docker rmi $(docker images | grep none | awk ' { print $3 }')

docker volume prune -f
