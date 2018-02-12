#!/bin/bash

# $1 == HASH
# import contract hash.avm "params" 01 False False

if (( $# == 1 )); then
   lhash=`echo "$1" | base64 --decode`
   #echo "HASH: $lhash"
   #echo "code: $2"
   cd /opt/neo-python/

   strexit=`echo "exit" | xxd -p`
   strsearch=`echo "contract $lhash" | xxd -p -c 256`

   python3 unsafeprompt.py -p -e $strexit,$strsearch
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
