#!/bin/bash
export PATH=$PATH:/neo-compiler/neon/bin/Release/netcoreapp2.0/
echo $COMPILECODE | base64 --decode > /tmp/NeoContract1/Contract1.cs
rm -f /tmp/NeoContract1/bin/Release/NeoContract1.*
cd /tmp
cp /usr/lib/mono/4.5/mscorlib.dll /tmp/NeoContract1/bin/Release # needed for Actions in ICO_Template
echo -n "{ \"output\": \""
echo "Neo compiler version (latest): " >> /tmp/output.txt
cat /neo-compiler/neon/*.csproj | grep "<Version>" >> /tmp/output.txt
echo "Smart Contract Framework version (latest): " >> /tmp/output.txt
cat /neo-devpack-dotnet/Neo.SmartContract.Framework/*.csproj | grep "<Version>" >> /tmp/output.txt
#xbuild /p:Configuration=Release | base64 -w 0
msbuild /p:Configuration=Release >> /tmp/output.txt
cat /tmp/output.txt | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /tmp/NeoContract1/bin/Release/NeoContract1.avm ]; then
   cat /tmp/NeoContract1/bin/Release/NeoContract1.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /tmp/NeoContract1/bin/Release/NeoContract1.abi.json ]; then
   cat /tmp/NeoContract1/bin/Release/NeoContract1.abi.json | base64 -w 0
fi
echo "\"}"
