#!/bin/bash
export PATH=$PATH:/neo-compiler/neoj/bin/Debug/netcoreapp1.1/
echo $COMPILECODE | base64 --decode > /tmp/Neoj/JavaContract.java
cp /usr/lib/mono/4.5/mscorlib.dll /tmp/Neoj/
echo -n "{ \"output\": \""
#xbuild /p:Configuration=Release | base64 -w 0
javac /tmp/Neoj/JavaContract.java -cp /tmp/Neoj/org.neo.smartcontract.framework.jar > /tmp/out.txt
dotnet /tmp/Neoj/neoj.dll JavaContract.class >> /tmp/out.txt
cat /tmp/out.txt | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /tmp/Neoj/JavaContract.avm ]; then
   cat /tmp/Neoj/JavaContract.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /tmp/Neoj/JavaContract.abi.json ]; then
   cat /tmp/Neoj/JavaContract.abi.json | base64 -w 0
fi
echo "\"}"
