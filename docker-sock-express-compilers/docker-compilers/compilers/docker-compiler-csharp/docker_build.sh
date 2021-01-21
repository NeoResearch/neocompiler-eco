#!/bin/bash
#https://github.com/neo-project/neo-devpack-dotnet/commits/master
COMPILER_VERSION=v3.0.0-preview4-c7e0f03
COMPILER_COMMIT_DEVPACK=c7e0f0349a6a39bc188acecb4f5c2e66340de583
REPO_DEVPACK=https://github.com/neo-project/neo-devpack-dotnet.git
BRANCH_DEVPACK=master

ARGS="--build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "Building ARGS are: $ARGS"

docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
#docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest3x"
