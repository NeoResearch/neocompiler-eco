#!/bin/bash

# $1 == HASH
# import contract hash.avm "params" 01 False False

if (( $# == 1 )); then
   lhash=`echo "$1" | base64 --decode`
   #echo "HASH: $lhash"
   #echo "code: $2"
   cd /opt/neo-python/

   stropen=`echo "open wallet w1.wallet" | xxd -p`
   strrebuild=`echo "wallet rebuild" | xxd -p`
   strshowwallet=`echo "wallet" | xxd -p`
   strexit=`echo "exit" | xxd -p`
   strsearch=`echo "contract $lhash" | xxd -p -c 256`
   strinvoke=`echo "testinvoke $lhash" | xxd -p -c 256`

   #echo "exit: $strexit"
   #python3 unsafeprompt.py -p -e $stropen,$strimport,$strexit > $lhash.importout
   #python3 unsafeprompt.py -p -e $strexit,$strimport,$strshowwallet,$strrebuild,$stropen
   python3 unsafeprompt.py -p -e $strexit,$strinvoke,$strshowwallet,$strrebuild,$stropen

   cat $lhash.invoke

   #strcmd="python3 unsafeprompt.py -p -e "
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
