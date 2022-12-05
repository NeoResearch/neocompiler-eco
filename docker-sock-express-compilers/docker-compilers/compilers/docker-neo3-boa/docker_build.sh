#!/bin/bash
#https://github.com/CityOfZion/neo3-boa/commits/master
COMPILER_VERSION=v0.11.4
COMPILER_COMMIT_NEO3BOA=0f159f739a64a041d8e2ecb446ed72c152cd199c
REPO_DEVPACK=https://github.com/CityOfZion/neo3-boa.git
BRANCH_DEVPACK=master

ARGS="--build-arg COMPILER_COMMIT_NEO3BOA=$COMPILER_COMMIT_NEO3BOA --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "Building ARGS are: $ARGS"

docker build $ARGS -t docker-neo3-boa-compiler:$COMPILER_VERSION .
