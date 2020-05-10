#!/bin/bash
#================================================
#Building lastest version of compilers
source .env

if (($BUILD_CSHARP)); then
	echo "BUILDING BUILDING mono-neo-compiler $BUILD_CSHARP"
	(cd compilers/docker-compiler-csharp; ./docker_build.sh; ./docker_build_list_of_compilers.sh)
else
	echo "SKIPING BUILDING mono-neo-compiler $BUILD_CSHARP";
fi

if (($BUILD_GO)); then
	echo "BUILDING BUILDING neo-go-compiler"
	(cd compilers/docker-compiler-go; ./docker_build.sh)
else
	echo "SKIPING BUILDING neo-go-compiler";
fi

if (($BUILD_BOA)); then
	echo "BUILDING neo-boa-compiler"
	(cd compilers/docker-compiler-python; ./docker_build.sh)
else
	echo "SKIPING neo-boa-compiler";
fi

if (($BUILD_JAVA)); then
	echo "BUILDING neo-java-compiler"
	(cd compilers/docker-compiler-java; ./docker_build.sh)
else
	echo "SKIPING neo-java-compiler";
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
