#!/bin/bash
source .env

echo "fuser -k at port $DOOR_ECOSERVICES"
fuser -k $DOOR_ECOSERVICES/tcp & 
