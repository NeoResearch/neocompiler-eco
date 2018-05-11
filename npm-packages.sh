#!/bin/bash
echo "PRUNING any useless NPM dep";
npm prune

echo "INSTALLING with NPM";
npm install
