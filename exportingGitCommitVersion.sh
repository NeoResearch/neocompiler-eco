#!/bin/bash
echo "Exporting COMMIT_GIT_VERSION version"
export COMMIT_GIT_VERSION=`git log --format="%H" -n 1`
