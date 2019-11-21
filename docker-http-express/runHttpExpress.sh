#!/bin/bash
echo "fuser -k at port $DOOR_FRONTEND_HTTP"
fuser -k  $DOOR_FRONTEND_HTTP/tcp

echo "Refreshing npm install"
npm install

echo "Updating package.json (you should commit if changed)"
npm update

echo "starting appHttp.js at port $DOOR_FRONTEND_HTTP"
node appHttp.js
