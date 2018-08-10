#!/bin/bash
DOOR_HTTP=8000

echo "fuser -k on port $DOOR_HTTP"
fuser -k  $DOOR_HTTP/tcp

echo "starting appHttp.js at port $DOOR_HTTP"
node appHttp.js
