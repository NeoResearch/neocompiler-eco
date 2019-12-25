#!/bin/bash
echo "Building list of enabled compilers"
./buildCompilers.sh

echo "fuser -k on port $DOOR_COMPILERS"
fuser -k  $DOOR_COMPILERS/tcp

echo "Refreshing npm install"
npm install

echo "starting appCompiler.js at port $DOOR_COMPILERS"
node appCompiler.js
