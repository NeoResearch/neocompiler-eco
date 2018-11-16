#!/bin/bash
COMPILER_VERSION=2.0.3.9.1
COMPILER_COMMIT_NEOCOMPILER=8cf1c019dfe5dcbb2c10c03c3ed61a3d4716325c
COMPILER_COMMIT_DEVPACK=90fb64c142b37509a7c548b8507b3de188b1ac4d
docker build --build-arg commitNeoCompiler=$COMPILER_COMMIT_NEOCOMPILER --build-arg commitDevpackDotnet=$COMPILER_COMMIT_DEVPACK -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
