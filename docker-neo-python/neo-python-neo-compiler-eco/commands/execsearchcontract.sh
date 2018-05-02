#!/bin/bash

# $1 == HASH
# import contract hash.avm "params" 01 False False


if (( $# == 1 )); then
   #cd /neo-python/
   export randomFolder=$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 32)
   cp -r /neo-python/ /neo-python$randomFolder
   cp -r /opt/node1/neo-cli/Chain /neo-python$randomFolder/Chains/privnet
   cd /neo-python$randomFolder

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

#   rm -rf Chains/privnet
#   rm -rf Chains/privnet/*
#   rm -rf Chains/*

   python3 unsafeprompt.py -p -e $strexit,$strsearch,$strsceventsON,$strshowwallet,$stropen,$strsceventsOFF


   echo "Time to delete folder"
   rm -rf /neo-python$randomFolder/
   echo "Bye bye... :D"
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
