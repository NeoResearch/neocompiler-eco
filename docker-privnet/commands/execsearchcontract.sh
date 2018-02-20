#!/bin/bash

# $1 == HASH
# import contract hash.avm "params" 01 False False


if (( $# == 1 )); then
   lhash=`echo "$1" | base64 --decode`
   #echo "HASH: $lhash"
   #echo "code: $2"
   stropen=`echo "open wallet w1.wallet" | xxd -p`
   strrebuild=`echo "wallet rebuild" | xxd -p`
   strshowwallet=`echo "wallet" | xxd -p`
   strexit=`echo "exit" | xxd -p`
   strsearch=`echo "contract $lhash" | xxd -p -c 256`
   strsceventsOff=`echo "config sc-events off" | xxd -p -c 256`
   strsceventsON=`echo "config sc-events on" | xxd -p -c 256`

   cd /opt/neo-python/
#   rm -rf Chains/privnet
#   rm -rf Chains/privnet/*
#   rm -rf Chains/*

   python3 unsafeprompt.py -p -e $strexit,$strsearch,$strsceventsON,$strshowwallet,$strrebuild,$stropen,$strsceventsOFF
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
