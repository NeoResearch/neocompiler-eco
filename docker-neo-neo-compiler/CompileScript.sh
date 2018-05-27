#!/bin/bash
export PATH=$PATH:/neo-compiler/neon/bin/Release/netcoreapp2.0/
cd /neo-code
mkdir build
rm -rf build/*
dotnet restore
msbuild /p:Configuration=Release
cp neo/bin/Release/netstandard2.0/* build/
