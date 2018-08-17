#!/bin/bash
#Other versions
COMPILER_VERSION=2.0.3.7 
COMPILER_COMMIT=243d773470464c4d2094d947a0431f365a1d19b7 
docker build --build-arg commit=$COMPILER_COMMIT -t docker-mono-neo-compiler:$COMPILER_VERSION .
