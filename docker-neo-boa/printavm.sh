#!/bin/bash
echo $COMPILECODE | base64 --decode > /tmp/NeoContract.py

echo -n "{ \"output\": \""
python3 compiler.py | base64 -w 0
echo -n "\", \"avm\": \""
if [ -f /tmp/NeoContract.avm ]; then
   cat /tmp/NeoContract.avm | xxd -p | base64 -w 0
fi
echo -n "\", \"abi\":\""
if [ -f /tmp/NeoContract.abi.json ]; then
   cat /tmp/NeoContract.abi.json | base64 -w 0
fi
echo "\"}"
