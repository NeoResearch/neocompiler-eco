#!/bin/bash
echo "fuser -k at port $DOOR_ECOSERVICES"
fuser -k  $DOOR_ECOSERVICES/tcp

echo "Refreshing npm install"
npm install

echo "starting appEcoServices.js at port $DOOR_ECOSERVICES"
PWD_CN_BLOCKTIME=$PWD_CN_BLOCKTIME PWD_RESET_SERVICE=$PWD_RESET_SERVICE node appEcoServices.js
