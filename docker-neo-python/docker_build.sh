#!/bin/bash
CONTAINER_NAME="eco-neo-python"
#VERSION="0.6.6"
docker build -t $CONTAINER_NAME:latest .
#docker tag $CONTAINER_NAME:$VERSION $CONTAINER_NAME:latest
