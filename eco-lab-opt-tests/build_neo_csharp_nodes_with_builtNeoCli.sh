#!/bin/bash

echo "Building docker neo-csharp-nodes with specific neo-cli."
../docker-neo-csharp-nodes/docker_build.sh --neo-cli ./docker-build-neo-cli/neo-cli-built.zip
