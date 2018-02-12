#!/bin/bash

# $1 == HASH
# $2 == PARAMS
# testinvoke $1 $2
# $3 == WALLET

if (( $# == 3 )); then
   wallet=`echo "$3" | base64 --decode`
   parm=`echo $2 | base64 --decode`
   lhash=`echo "$1" | base64 --decode`
   #echo "HASH: $lhash"
   #echo "code: $2"
   cd /opt/neo-python/

   stropen=`echo "open wallet $wallet" | xxd -p`
   strrebuild=`echo "wallet rebuild" | xxd -p`
   strshowwallet=`echo "wallet" | xxd -p`
   strexit=`echo "exit" | xxd -p`
   strinvoke=`echo "testinvoke $lhash $parm" | xxd -p -c 256`

   python3 unsafeprompt.py -p -e $strexit,$strinvoke,$strshowwallet,$strrebuild,$stropen

   echo "TESTINVOKE OUTPUT:"
   cat $lhash.invoke
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
