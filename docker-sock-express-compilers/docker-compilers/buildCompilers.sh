#!/bin/bash
#================================================
#Building lastest version of compilers
source .env

if (($BUILD_CSHARP)); then
	echo "BUILDING BUILDING mono-neo-compiler $BUILD_CSHARP"
	(cd compilers/docker-compiler-csharp; ./docker_build.sh)
else
	echo "SKIPING BUILDING mono-neo-compiler $BUILD_CSHARP";
fi
#================================================

#================================================
#Building all available version of compilers
if (($BUILD_ALL_CSHARP)); then
	echo "BUILDING all C# compilers"
	(cd compilers/docker-compiler-csharp; ./docker_build_list_of_compilers.sh)
else
	echo "SKIPING build of all C# Compilers";
fi
#================================================
