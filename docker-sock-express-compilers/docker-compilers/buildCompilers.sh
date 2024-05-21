#!/bin/bash
#================================================
#Building lastest version of compilers
source .env

if [ $BUILD_CSHARP != 0 ] || [ $BUILD_ALL != 0 ]; then
	echo "BUILDING BUILDING mono-neo-compiler $BUILD_CSHARP"
	(cd compilers/docker-compiler-csharp; ./docker_build.sh)
else
	echo "SKIPING BUILDING mono-neo-compiler $BUILD_CSHARP";
fi

if [ $BUILD_BOA != 0 ] || [ $BUILD_ALL != 0 ]; then
	echo "BUILDING BUILDING neo3-boa $BUILD_BOA"
	(cd compilers/docker-neo3-boa; ./docker_build.sh)
else
	echo "SKIPING BUILDING neo3-boa $BUILD_BOA";
fi
#================================================

#================================================
#Building all available version of compilers
if (($BUILD_ALL_CSHARP)); then
	echo "BUILDING all C# compilers"
	(cd compilers/docker-compiler-csharp; ./list_of_compilers_docker_build.sh)
else
	echo "SKIPING build of all C# Compilers";
fi
#================================================
