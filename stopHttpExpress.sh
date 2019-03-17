#!/bin/bash
source .env

#Http
echo "fuser -k on port $DOOR_HTTP"
fuser -k  $DOOR_HTTP/tcp &
