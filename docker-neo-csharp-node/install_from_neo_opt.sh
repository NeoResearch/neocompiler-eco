#!/bin/bash
# assuming neocompiler-eco and neo-opt-tests are in same hierarchy (TODO: use ENV to control this)
rm -f neo-cli-built.zip
rm -f neo-cli.zip
cp ../../neo-tests/docker-configure-neo/build/neo-cli-built.zip  .
./docker_build.sh --neo-cli ./neo-cli-built.zip
