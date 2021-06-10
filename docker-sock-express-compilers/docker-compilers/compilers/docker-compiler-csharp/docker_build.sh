#!/bin/bash
#https://github.com/neo-project/neo-devpack-dotnet/commits/master
COMPILER_VERSION=v3.0.0-rc3
COMPILER_COMMIT_DEVPACK=99c15f42bff0e295d81bf336d6539470d49a35b8
REPO_DEVPACK=https://github.com/neo-project/neo-devpack-dotnet.git
BRANCH_DEVPACK=master

ARGS="--build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "Building ARGS are: $ARGS"

docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
#docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest3x"
