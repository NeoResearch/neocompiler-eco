#!/bin/bash
echo "fuser -k on port $DOOR_HTTP"
fuser -k  $DOOR_HTTP/tcp

echo "pruning npm packages"
npm prune

echo "Refreshing npm install"
npm install

echo "starting appHttp.js at port $DOOR_HTTP"
node appHttp.js
