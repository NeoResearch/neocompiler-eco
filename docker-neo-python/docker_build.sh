#!/bin/bash
CONTAINER_NAME="neo-compiler-neo-python"
VERSION="0.6.6"
docker build -t $CONTAINER_NAME:$VERSION .
docker tag $CONTAINER_NAME:$VERSION $CONTAINER_NAME:latest
