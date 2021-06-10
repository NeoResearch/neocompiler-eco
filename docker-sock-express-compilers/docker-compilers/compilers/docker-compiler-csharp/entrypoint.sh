#!/bin/bash
rm -rf /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/Contract1.cs
echo $COMPILECODE | base64 --decode | funzip > /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/Contract1.cs
#echo -n "{ \"output\": \""
echo -n "{ \"output\": \"" >> /tmp/return.txt
echo "Neo compiler version (latest): " >> /tmp/output.txt
cat /neo-devpack-dotnet/src/Neo.Compiler.CSharp/*.csproj | grep "<Version>" >> /tmp/output.txt
echo "Git log: " >> /tmp/output.txt
(cd /neo-devpack-dotnet && git log --format="%H" -n 1) >> /tmp/output.txt

#Still not printing version
#echo "Smart Contract Framework version (latest): " >> /tmp/output.txt
#cat /neo-devpack-dotnet/src/Neo.SmartContract.Framework/*.csproj | grep "<Version>" >> /tmp/output.txt

echo "Building..." >> /tmp/output.txt
echo "" >> /tmp/output.txt

(cd /neo-devpack-dotnet/ && dotnet build ./src/Template.CSharpNeoCompiler/) >> /tmp/output.txt

echo "" >> /tmp/output.txt
echo "Code to be built has been built!!" >> /tmp/output.txt
echo "" >> /tmp/output.txt

# Convert all previous output on /tmp/output.txt to base64
cat /tmp/output.txt | base64 -w 0 >> /tmp/return.txt

# Add new output related to the AVM, ABI and MANIFEST
echo -n "\", \"nef\": \"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.nef ]; then
   cat /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.nef | base64 -w 0 >> /tmp/return.txt
fi
#echo -n "\", \"abi\":\"" >> /tmp/return.txt
#if [ -f /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.abi.json ]; then
#   cat /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.abi.json | base64 -w 0 >> /tmp/return.txt
#fi
echo -n "\", \"manifest\":\"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.manifest.json ]; then
   cat /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.manifest.json | base64 -w 0 >> /tmp/return.txt
fi
echo -n "\"}" >> /tmp/return.txt

# display result in stdout
cat /tmp/return.txt

#sleep infinity
