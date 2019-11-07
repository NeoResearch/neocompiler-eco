#!/bin/bash
COMPILER_VERSION=2.3.0.9-dev
COMPILER_COMMIT_NEOCOMPILER=e404355ea4692bd599b24fb9b5928c1dee46b45e
COMPILER_COMMIT_DEVPACK=bc988da9a7620a290a79fb27f959b407a947dd2a
docker build --build-arg commitNeoCompiler=$COMPILER_COMMIT_NEOCOMPILER --build-arg commitDevpackDotnet=$COMPILER_COMMIT_DEVPACK -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
