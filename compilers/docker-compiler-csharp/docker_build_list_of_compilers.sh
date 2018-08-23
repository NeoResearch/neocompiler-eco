#!/bin/bash
#Other versions
COMPILER_VERSION=2.0.3.8 
COMPILER_COMMIT=243d773470464c4d2094d947a0431f365a1d19b7 
docker build --build-arg commit=$COMPILER_COMMIT -t docker-mono-neo-compiler:$COMPILER_VERSION .

COMPILER_VERSION=2.0.3.2
COMPILER_COMMIT=b1a51623233741070f89a2f9168f188f1f0ae109 
docker build --build-arg commit=$COMPILER_COMMIT -t docker-mono-neo-compiler:$COMPILER_VERSION .

