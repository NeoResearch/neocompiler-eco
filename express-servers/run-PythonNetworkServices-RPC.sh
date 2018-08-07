#!/bin/bash
#DEBUG=neocompilersonly:* PORT=1000 
DOOR_COMPILERS=8500
fuser -k  $DOOR_COMPILERS/tcp

node appPythonNetworkServices.js
