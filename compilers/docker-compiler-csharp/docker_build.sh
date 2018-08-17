#!/bin/bash
COMPILER_VERSION=2.0.3.8
COMPILER_COMMIT=90f7a47de921dbb6679894b3a10b8217d6e4d898
docker build --build-arg commit=$COMPILER_COMMIT -t docker-mono-neo-compiler:$COMPILER_VERSION .
docker tag docker-mono-neo-compiler:$COMPILER_VERSION "docker-mono-neo-compiler:latest"
