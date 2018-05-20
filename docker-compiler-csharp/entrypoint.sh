#!/bin/bash
export PATH=$PATH:/neo-compiler/neon/bin/Release/netcoreapp2.0/
echo $COMPILECODE | base64 --decode > /tmp/NeoContract1/Contract1.cs
rm -f /tmp/NeoContract1/bin/Release/NeoContract1.*
cd /tmp
cp /usr/lib/mono/4.5/mscorlib.dll /tmp/NeoContract1/bin/Release # needed for Actions in ICO_Template
echo -n "{ \"output\": \""
#xbuild /p:Configuration=Release | base64 -w 0
msbuild /p:Configuration=Release | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /tmp/NeoContract1/bin/Release/NeoContract1.avm ]; then
   cat /tmp/NeoContract1/bin/Release/NeoContract1.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /tmp/NeoContract1/bin/Release/NeoContract1.abi.json ]; then
   cat /tmp/NeoContract1/bin/Release/NeoContract1.abi.json | base64 -w 0
fi
echo "\"}"
