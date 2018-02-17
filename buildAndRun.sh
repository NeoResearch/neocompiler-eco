#!/bin/bash
echo "BUILDING mono-neo-compiler";
export DOCKERNEOCOMPILER=$((cd docker-neo; docker build . | tail -n 1 ) | awk 'NR==1{print $3}')
echo "RUNNING NeoCompiler.io server (sponsored by NeoResearch)";
./run.sh
