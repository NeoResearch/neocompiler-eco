#!/bin/bash
#================================================
#Building last version of online compiler
echo "BUILDING ubuntu-dotnet";
(cd docker-ubuntu-dotnet; ./docker_build.sh)

echo "BUILDING mono-neo-compiler";
(cd docker-compiler-csharp; ./docker_build.sh)

echo "BUILDING neo-boa-compiler";
(cd docker-compiler-python; ./docker_build.sh)

echo "BUILDING neo-go-compiler";
(cd docker-compiler-go; ./docker_build.sh)

echo "BUILDING neo-java-compiler";
(cd docker-compiler-java; ./docker_build.sh)
#================================================
