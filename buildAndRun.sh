#!/bin/bash
(cd docker-neo; docker build .)
export DOCKERNEOCOMPILER=$(docker images | awk 'NR==2{print $3}')
./run.sh
