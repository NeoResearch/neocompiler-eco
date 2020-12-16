#!/bin/bash
#=============================================================
#================ BEGIN OTHER VERSIONS =======================

#================ vxxx =====================================
COMPILER_COMMIT_DEVPACK=10ddae3b356c43e51c99affa4bdda5df2fd85168
COMPILER_VERSION=v3.0.0-atoi-itoi
REPO_DEVPACK=https://github.com/shargon/neo-devpack-dotnet.git
BRANCH_DEVPACK=sync-neo
ARGS="--build-arg COMPILER_COMMIT_DEVPACK=$COMPILER_COMMIT_DEVPACK --build-arg BRANCH_DEVPACK=$BRANCH_DEVPACK --build-arg REPO_DEVPACK=$REPO_DEVPACK"

echo "\nBuilding Version $COMPILER_VERSION with ARGS: $ARGS \n"
docker build $ARGS -t docker-mono-neo-compiler:$COMPILER_VERSION .
#=============================================================

#================== END OTHER VERSIONS =======================
#=============================================================
