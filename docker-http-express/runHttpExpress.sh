#!/bin/bash
echo "fuser -k at port $DOOR_FRONTEND_HTTP"
fuser -k  $DOOR_FRONTEND_HTTP/tcp

echo "Refreshing npm install"
npm install

echo "starting appHttp.js at port $DOOR_FRONTEND_HTTP"
node appHttp.js
