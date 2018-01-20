#!/bin/bash
export PATH=$PATH:/neo-compiler/neon/bin/Release/netcoreapp1.0/
echo $COMPILECODE | base64 --decode > buildtmp/NeoContract1/Contract1.cs
rm -f /buildtmp/NeoContract1/bin/Debug/NeoContract1.*
cd buildtmp
echo -n "{ output: '"
xbuild | base64 -w 0
echo -n "', avm: '"
if [ -f /buildtmp/NeoContract1/bin/Debug/NeoContract1.avm ]; then
   cat /buildtmp/NeoContract1/bin/Debug/NeoContract1.avm | base64 -w 0
fi
echo -n "', abi:'"
if [ -f /buildtmp/NeoContract1/bin/Debug/NeoContract1.abi.json ]; then
   cat /buildtmp/NeoContract1/bin/Debug/NeoContract1.abi.json | base64 -w 0
fi
echo "'}"
