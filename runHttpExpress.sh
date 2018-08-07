#!/bin/bash
#DEBUG=neocompilersonly:* PORT=1000 
DOOR_COMPILERS=8000
fuser -k  $DOOR_COMPILERS/tcp

node appHttp.js
