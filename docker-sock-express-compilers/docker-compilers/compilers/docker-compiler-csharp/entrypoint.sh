#!/bin/bash
rm -rf /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/Contract1.cs
echo $COMPILECODE | base64 --decode | funzip > /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/Contract1.cs
#echo -n "{ \"output\": \""
echo -n "{ \"output\": \"" >> /tmp/return.txt
echo "Neo compiler version (latest): " >> /tmp/output.txt
cat /neo-devpack-dotnet/src/Neo.Compiler.MSIL/*.csproj | grep "<Version>" >> /tmp/output.txt
echo "Git log: " >> /tmp/output.txt
(cd /neo-devpack-dotnet && git log --format="%H" -n 1) >> /tmp/output.txt
echo "Smart Contract Framework version (latest): " >> /tmp/output.txt
cat /neo-devpack-dotnet/src/Neo.SmartContract.Framework/*.csproj | grep "<Version>" >> /tmp/output.txt
(cd /neo-devpack-dotnet/ && dotnet build ./templates/Template.CSharpNeoCompiler/Template.CSharpNeoCompiler.csproj) >> /tmp/output.txt

# Convert all previous output on /tmp/output.txt to base64
cat /tmp/output.txt | base64 -w 0 >> /tmp/return.txt

# Add new output related to the AVM, ABI and MANIFEST
echo -n "\", \"avm\": \"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/net5.0/Template.CSharpNeoCompiler.nef ]; then
   cat /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/net5.0/Template.CSharpNeoCompiler.nef | xxd -p | base64 -w 0 >> /tmp/return.txt
fi
echo -n "\", \"abi\":\"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/net5.0/Template.CSharpNeoCompiler.abi.json ]; then
   cat /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/net5.0/Template.CSharpNeoCompiler.abi.json | base64 -w 0 >> /tmp/return.txt
fi
echo -n "\", \"manifest\":\"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/net5.0/Template.CSharpNeoCompiler.abi.json ]; then
   cat /neo-devpack-dotnet/templates/Template.CSharpNeoCompiler/bin/Debug/net5.0/Template.CSharpNeoCompiler.manifest.json | base64 -w 0 >> /tmp/return.txt
fi
echo -n "\"}" >> /tmp/return.txt

# display result in stdout
cat /tmp/return.txt

#sleep infinity
