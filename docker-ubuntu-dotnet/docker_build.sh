#!/bin/bash
CONTAINER_NAME="ubuntu-dotnet"
VERSION="18.04-2.1.200"
docker build -t $CONTAINER_NAME:$VERSION .
