#!/bin/bash
source .env

echo "fuser -k on port $DOOR_COMPILERS"
fuser -k -s $DOOR_COMPILERS/tcp & 

echo "fuser -k at port $DOOR_ECOSERVICES"
fuser -k $DOOR_ECOSERVICES/tcp & 
