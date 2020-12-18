#!/bin/bash
#https://github.com/neo-project/neo-devpack-dotnet
COMPILER_VERSION=v3.0.0-CI01105
COMPILER_COMMIT_DEVPACK=fac2847b7c1e1cec03ab8ab8427e258102b66569
REPO_DEVPACK=https://github.com/neo-project/neo-devpack-dotnet.git
BRANCH_DEVPACK=master


ARGS="--build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "Building ARGS are: $ARGS"

docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
#docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest3x"
