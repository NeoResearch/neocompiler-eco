#!/bin/bash
export PATH=$PATH:/neo-compiler/neoj/bin/Debug/netcoreapp1.1/
echo $COMPILECODE | base64 --decode > /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.java
cp /usr/lib/mono/4.5/mscorlib.dll /neo-compiler/neoj/bin/Debug/netcoreapp1.1/
echo -n "{ \"output\": \""
#xbuild /p:Configuration=Release | base64 -w 0
javac /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.java -cp /neo-compiler/neoj/bin/Debug/netcoreapp1.1/org.neo.smartcontract.framework.jar > /tmp/out.txt
dotnet /neo-compiler/neoj/bin/Debug/netcoreapp1.1/neoj.dll /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.class >> /tmp/out.txt
cat /tmp/out.txt | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.avm ]; then
   cat /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.abi.json ]; then
   cat /neo-compiler/neoj/bin/Debug/netcoreapp1.1/JavaContract.abi.json | base64 -w 0
fi
echo "\"}"
