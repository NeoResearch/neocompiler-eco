#!/bin/bash
CONTAINER_NAME="neo-compiler-neo-python"
VERSION="0.6.9"
docker build -t $CONTAINER_NAME:0.6.9 .
docker tag $CONTAINER_NAME:$VERSION $CONTAINER_NAME:latest
