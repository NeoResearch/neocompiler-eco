#!/bin/bash
#https://github.com/neo-project/neo-devpack-dotnet/commits/master
COMPILER_VERSION=v3.7.4
COMPILER_COMMIT_DEVPACK=0b6b19a9937657ff4fc93a3ef0452eb3c8e848ee
REPO_DEVPACK=https://github.com/neo-project/neo-devpack-dotnet.git
BRANCH_DEVPACK=master

ARGS="--build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "Building ARGS are: $ARGS"

docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
#docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest3x"
