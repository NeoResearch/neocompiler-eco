#!/bin/bash
DOOR_COMPILERS=10000

echo "fuser -k on port $DOOR_COMPILERS"
fuser -k  $DOOR_COMPILERS/tcp

echo "starting appCompiler.js at port $DOOR_COMPILERS"
node appCompiler.js
