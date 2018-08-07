#!/bin/bash
#DEBUG=neocompilersonly:* PORT=1000 
DOOR_COMPILERS=9000
fuser -k  $DOOR_COMPILERS/tcp

node appCompiler.js
