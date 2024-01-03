#!/bin/bash
# $1 is the height
cat /opt/node/neo-cli/Storage/BlockStorage_100000/dump-block-"$1".json | tail -n 500
