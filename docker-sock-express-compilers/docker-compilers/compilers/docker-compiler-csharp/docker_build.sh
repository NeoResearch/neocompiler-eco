#!/bin/bash
COMPILER_VERSION=2.9.4-dev
# https://github.com/neo-project/neo-compiler/commits/master-2.x
COMPILER_COMMIT_NEOCOMPILER=f6b05a6ebea9ce99133cfaf47f154f154c0645ca
#https://github.com/neo-project/neo-devpack-dotnet/commits/master-2.x
COMPILER_COMMIT_DEVPACK=8a0c998a531aa3754d79fb3299a988a885a30dab
docker build --build-arg commitNeoCompiler=$COMPILER_COMMIT_NEOCOMPILER --build-arg commitDevpackDotnet=$COMPILER_COMMIT_DEVPACK -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
