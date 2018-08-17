#!/bin/bash
COMPILER_VERSION=2.0.3.8
COMPILER_COMMIT=90f7a47de921dbb6679894b3a10b8217d6e4d898
docker build --build-arg commit=$COMPILER_COMMIT -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"

#Other versions
# COMPILER_VERSION=2.0.3.7 COMPILER_COMMIT=243d773470464c4d2094d947a0431f365a1d19b7 
