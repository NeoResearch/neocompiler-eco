#!/bin/bash
export PATH=$PATH:/neo-compiler/neon/bin/Release/netcoreapp1.0/
echo $COMPILECODE | base64 --decode > buildtmp/NeoContract1/Contract1.cs
rm -f /buildtmp/NeoContract1/bin/Release/NeoContract1.*
cd buildtmp
cp /usr/lib/mono/4.5/mscorlib.dll /buildtmp/NeoContract1/bin/Release
echo -n "{ \"output\": \""
#xbuild /p:Configuration=Release | base64 -w 0 
msbuild /p:Configuration=Release | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /buildtmp/NeoContract1/bin/Release/NeoContract1.avm ]; then
   cat /buildtmp/NeoContract1/bin/Release/NeoContract1.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /buildtmp/NeoContract1/bin/Release/NeoContract1.abi.json ]; then
   cat /buildtmp/NeoContract1/bin/Release/NeoContract1.abi.json | base64 -w 0
fi
echo "\"}"
