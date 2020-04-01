#!/bin/bash
rm -rf /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/Contract1.cs
echo $COMPILECODE | base64 --decode | funzip > /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/Contract1.cs
echo -n "{ \"output\": \""
echo "Neo compiler version (latest): " >> /tmp/output.txt
cat /neo-devpack-dotnet/src/Neo.Compiler.MSIL/*.csproj | grep "<Version>" >> /tmp/output.txt
echo "Git log: " >> /tmp/output.txt
(cd /neo-devpack-dotnet && git log --format="%H" -n 1) >> /tmp/output.txt
echo "Smart Contract Framework version (latest): " >> /tmp/output.txt
cat /neo-devpack-dotnet/src/Neo.SmartContract.Framework/*.csproj | grep "<Version>" >> /tmp/output.txt
(cd /neo-devpack-dotnet/ && dotnet build ./templates/Template.CSharpNeoCompiler/Template.CSharpNeoCompiler.csproj) >> /tmp/output.txt

# Convert all previous output on /tmp/output.txt to base64 
cat /tmp/output.txt | base64 -w 0

# Add new output related to the AVM, ABI and MANIFEST
echo -n "\", \"avm\": \""
if [ -f /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/netstandard2.1/Template.CSharpNeoCompiler.nef ]; then
   cat /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/netstandard2.1/Template.CSharpNeoCompiler.nef | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/netstandard2.1/Template.CSharpNeoCompiler.abi.json ]; then
   cat /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/netstandard2.1/Template.CSharpNeoCompiler.abi.json | base64 -w 0
fi
echo -n "\", \"manifest\":\""
if [ -f /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/netstandard2.1/Template.CSharpNeoCompiler.abi.json ]; then
   cat /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/netstandard2.1/Template.CSharpNeoCompiler.manifest.json | base64 -w 0
fi
echo "\"}"
