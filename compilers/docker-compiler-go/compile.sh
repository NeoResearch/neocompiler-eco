#!/bin/sh

echo $COMPILECODE | base64 -d > /tmp/contract.go

echo -n "{ \"output\": \""
 ./bin/neo-go contract compile -i /tmp/contract.go -o /tmp/contract.avm > /tmp/output.txt 2> /tmp/output.err
cat /tmp/output.txt /tmp/output.err | base64 | tr -d '\n'
echo -n "\", \"avm\": \""
if [ -f /tmp/contract.avm ]; then
   cat /tmp/contract.avm | xxd -p | base64 | tr -d '\n'
fi
echo -n "\", \"abi\":\""
if [ -f /tmp/contract.abi.json ]; then
   cat /tmp/contract.abi.json | base64 | tr -d '\n'
fi
echo "\"}"
