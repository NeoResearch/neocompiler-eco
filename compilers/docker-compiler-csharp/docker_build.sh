#!/bin/bash
COMPILER_VERSION=2.0.3.9.1
COMPILER_COMMIT_NEOCOMPILER=bdbaa79e75728ed1e32503ae971350d551f9f5cb
COMPILER_COMMIT_DEVPACK=492bf28f30a94d56072d4ea2b94f0a5cae7a6b00
docker build --build-arg commitNeoCompiler=$COMPILER_COMMIT_NEOCOMPILER --build-arg commitDevpackDotnet=$COMPILER_COMMIT_DEVPACK -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
