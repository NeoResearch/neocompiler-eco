#!/bin/bash
COMPILER_VERSION=2.3.0.9-dev
COMPILER_COMMIT_NEOCOMPILER=51ea9c70ddb9c3fbd6ea71b3195685fb659ea0c8
COMPILER_COMMIT_DEVPACK=f238cc58873e3cc92ddf02b0acbc31bf690d143b
docker build --build-arg commitNeoCompiler=$COMPILER_COMMIT_NEOCOMPILER --build-arg commitDevpackDotnet=$COMPILER_COMMIT_DEVPACK -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
