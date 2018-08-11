#!/bin/bash
DOOR_ECOSERVICES=9000

echo "fuser -k at port $DOOR_ECOSERVICES"
fuser -k  $DOOR_ECOSERVICES/tcp

echo "starting appEcoServices.js at port $DOOR_ECOSERVICES"
node appEcoServices.js
