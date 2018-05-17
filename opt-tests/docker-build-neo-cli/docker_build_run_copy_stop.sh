#!/bin/bash
#
# Build new neo-cli using new files of neo-blockchain
#

CONTAINER_NAME="neo-build-neo-cli-with-new-blockchain-csharp"

./docker_build.sh

echo "RUNNING container:"
echo $CONTAINER_NAME
docker run -d --name $CONTAINER_NAME --rm $CONTAINER_NAME

#copy neo-cli-built.zip
echo "COPYING published zip file from container..."
docker cp $CONTAINER_NAME:/opt/neo-cli-built.zip ./neo-cli-built.zip

echo "STOPPING container"
docker stop $CONTAINER_NAME
