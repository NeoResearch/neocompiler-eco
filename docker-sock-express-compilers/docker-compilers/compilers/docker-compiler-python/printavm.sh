#!/bin/bash
echo $COMPILECODE | base64 --decode | funzip > /tmp/NeoContract.py

echo -n "{ \"output\": \""
python3 compiler.py > /tmp/output.txt 2> /tmp/output.err
pip3 show neo-boa >> /tmp/output.txt
cat /tmp/output.txt /tmp/output.err | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /tmp/NeoContract.avm ]; then
   cat /tmp/NeoContract.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /tmp/NeoContract.abi.json ]; then
   cat /tmp/NeoContract.abi.json | base64 -w 0
fi
echo "\"}"
