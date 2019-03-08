#!/bin/bash
# Clean all none images
docker rmi $(docker images | grep none | awk ' { print $3 }')

docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
