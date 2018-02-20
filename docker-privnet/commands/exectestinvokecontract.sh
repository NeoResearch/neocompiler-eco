#!/bin/bash

# $1 == HASH
# $2 == PARAMS
# testinvoke $1 $2
# $3 == WALLET


if (( $# == 4 )); then
   wallet=`echo "$4" | base64 --decode`
   neo=`echo "$3" | base64 --decode`
   parm=`echo $2 | base64 --decode`
   lhash=`echo "$1" | base64 --decode`
   #echo "HASH: $lhash"
   #echo "code: $2"
   stropen=`echo "open wallet $wallet" | xxd -p`
   strrebuild=`echo "wallet rebuild" | xxd -p`
   strshowwallet=`echo "wallet" | xxd -p`
   strexit=`echo "exit" | xxd -p`

   if [ "$neo" -eq "0" ]; then
      echo "testinvoke $lhash $parm";
      strinvoke=`echo "testinvoke $lhash $parm" | xxd -p -c 256`
   else
      echo "testinvoke $lhash $parm --attach-neo=$neo";
      strinvoke=`echo "testinvoke $lhash $parm --attach-neo=$neo" | xxd -p -c 256`
   fi

   strsceventsOFF=`echo "config sc-events off" | xxd -p -c 256`
   strsceventsON=`echo "config sc-events on" | xxd -p -c 256`

   cd /opt/neo-python/
#   rm -rf Chains/privnet
#   rm -rf Chains/privnet/*
#   rm -rf Chains/*
   rm $lhash.invoke
   
   python3 unsafeprompt.py -p -e $strexit,$strinvoke,$strsceventsON,$strshowwallet,$strrebuild,$stropen,$strsceventsOFF

   echo "TESTINVOKE OUTPUT:"
   cat $lhash.invoke
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
