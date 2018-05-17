#!/bin/bash
#
# Build new neo-cli using new files of neo-blockchain
#

CONTAINER_NAME="neo-build-neo-cli-with-new-blockchain-csharp"

echo "BUILDING neo cli with personalized characteristics..."
docker build -t  $CONTAINER_NAME:latest .
