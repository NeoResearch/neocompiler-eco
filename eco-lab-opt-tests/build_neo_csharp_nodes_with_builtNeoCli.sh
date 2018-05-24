#!/bin/bash

cp ./docker-build-neo-cli/neo-cli-built.zip ../docker-neo-csharp-nodes/

echo "Building docker neo-csharp-nodes with specific neo-cli."
(cd ../docker-neo-csharp-nodes/; ./docker_build.sh --neo-cli ./neo-cli-built.zip)
