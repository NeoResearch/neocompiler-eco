#!/bin/bash
#================================================
#Building last version of online compiler
echo "BUILDING mono-neo-compiler";
(cd compilers/docker-compiler-csharp; ./docker_build.sh)

echo "BUILDING neo-boa-compiler";
(cd compilers/docker-compiler-python; ./docker_build.sh)

echo "BUILDING neo-go-compiler";
(cd compilers/docker-compiler-go; ./docker_build.sh)

echo "BUILDING neo-java-compiler";
(cd compilers/docker-compiler-java; ./docker_build.sh)
#================================================
