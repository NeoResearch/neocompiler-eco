#!/bin/bash
#DEBUG=neocompilersonly:* PORT=1000 
DOOR_COMPILERS=10000
fuser -k  $DOOR_COMPILERS/tcp

node appEcoServices.js
