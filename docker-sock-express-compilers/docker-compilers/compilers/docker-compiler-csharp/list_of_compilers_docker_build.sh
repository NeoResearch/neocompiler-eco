#!/bin/bash
#=============================================================
#================ BEGIN OTHER VERSIONS =======================

#================ vxxx =====================================
COMPILER_COMMIT_DEVPACK=7ca0322a07b30653d286f30c64a7f2e82be53e67
COMPILER_VERSION=v3.0.0-rc1
REPO_DEVPACK=https://github.com/neo-project/neo-devpack-dotnet.git
BRANCH_DEVPACK=master
ARGS="--build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "\nBuilding Version $COMPILER_VERSION with ARGS: $ARGS \n"
docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
#=============================================================

#================== END OTHER VERSIONS =======================
#=============================================================
