#!/bin/sh

echo $COMPILECODE | base64 -d | funzip > /tmp/contract.go

echo -n "{ \"output\": \""
 ./bin/neo-go contract compile -i /tmp/contract.go -d -o /tmp/contract.avm > /tmp/output.txt 2> /tmp/output.err
(cd /go/src/github.com/CityOfZion/neo-go && git show | head -n 3 >> /tmp/output.txt)
echo "" >> /tmp/output.txt
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
