#!/bin/bash
#export PATH=$PATH:/neo-compiler/neoj/bin/Debug/netcoreapp1.1/
echo $COMPILECODE | base64 --decode > /tmp/JavaContract.java
#cp /usr/lib/mono/4.5/mscorlib.dll /neo-compiler/neoj/bin/Debug/netcoreapp1.1/
echo -n "{ \"output\": \""
#/usr/lib/jvm/java-8-openjdk-amd64/bin/javac -version > /tmp/out.txt
/usr/lib/jvm/java-8-openjdk-amd64/bin/javac /tmp/JavaContract.java -cp /usr/share/dotnet/org.neo.smartcontract.framework.jar 2>> /tmp/out.txt
dotnet /tmp/neoj.dll /tmp/JavaContract.class >> /tmp/out.txt
cat /tmp/out.txt | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /JavaContract.avm ]; then
   cat /JavaContract.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /JavaContract.abi.json ]; then
   cat /JavaContract.abi.json | base64 -w 0
fi
echo "\"}"
