#!/bin/bash

# CLEAN FILES AND PREVIOUS COMPILATIONS
rm  /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/*.cs 2> /dev/null
rm -r /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/ 2> /dev/null

for i in $(seq 1 $COMPILECODE_COUNT); do
  #echo $i; 
  j=$((i-1))
  #echo "base64 unzip compile parameter $j";
  varname=COMPILECODE_$j
  #echo "varname -> $varname"
  #echo "ZIP: ${!varname}"  
  echo ${!varname} | base64 --decode | funzip > /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/Contract$i.cs 
done

#echo $COMPILECODE_0 | base64 --decode | funzip > /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/Contract1.cs

echo -n "{ \"output\": \"" >> /tmp/return.txt
echo "Internal git log: " >> /tmp/output.txt
(cd /neo-devpack-dotnet && git log --format="%H" -n 1) >> /tmp/output.txt

#Still not printing version
#echo "Smart Contract Framework version (latest): " >> /tmp/output.txt
#cat /neo-devpack-dotnet/src/Neo.SmartContract.Framework/*.csproj | grep "<Version>" >> /tmp/output.txt

echo "COMPILING..." >> /tmp/output.txt
echo "" >> /tmp/output.txt

(cd /neo-devpack-dotnet/ && dotnet build ./src/Template.CSharpNeoCompiler/) >> /tmp/output.txt

echo "" >> /tmp/output.txt
echo "Command dotnet build has been executed...results are below:" >> /tmp/output.txt
echo "" >> /tmp/output.txt

# Convert all previous output on /tmp/output.txt to base64
cat /tmp/output.txt | base64 -w 0 >> /tmp/return.txt

# Add new output related to the AVM, ABI and MANIFEST
echo -n "\", \"nef\": \"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/*.nef ]; then
   cat /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/*.nef | base64 -w 0 >> /tmp/return.txt
fi
#echo -n "\", \"abi\":\"" >> /tmp/return.txt
#if [ -f /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.abi.json ]; then
#   cat /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/Template.CSharpNeoCompiler.abi.json | base64 -w 0 >> /tmp/return.txt
#fi
echo -n "\", \"manifest\":\"" >> /tmp/return.txt
if [ -f /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/*.manifest.json ]; then
   cat /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/bin/sc/*.manifest.json | base64 -w 0 >> /tmp/return.txt
fi
echo -n "\"}" >> /tmp/return.txt

# display result in stdout
cat /tmp/return.txt

#sleep infinity
