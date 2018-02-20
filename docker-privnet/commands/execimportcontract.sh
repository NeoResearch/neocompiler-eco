#!/bin/bash

# $1 == HASH
# import contract $2 $3 $4 $5 $6
# import contract hash.avm "params" 01 False False
# $7 == w1.wallet


if (( $# == 7 )); then
   cd /opt/neo-python/
   rm -rf Chains/privnet
   rm -rf Chains/privnet/*
   rm -rf Chains/*

   wallet=`echo "$7" | base64 --decode`
   lhash=`echo "$1" | base64 --decode`
   #echo "HASH: $lhash"
   #echo "code: $2"
   echo "$2" | base64 --decode | xxd -p -r > $lhash.avm
   parm=`echo $3 | base64 --decode`
   rv=`echo $4 | base64 --decode`
   rv=`echo \"$rv\"`
   op1=`echo $5 | base64 --decode`
   op2=`echo $6 | base64 --decode`

   stropen=`echo "open wallet $wallet" | xxd -p`
   strrebuild=`echo "wallet rebuild" | xxd -p`
   strshowwallet=`echo "wallet" | xxd -p`

   #echo "open: $stropen"
   strimport=`echo "import contract $lhash.avm $parm $rv $op1 $op2" | xxd -p -c 256`
   #echo "open: $strimport"
   strexit=`echo "exit" | xxd -p`
   strinvoke=`echo "testinvoke $lhash" | xxd -p -c 256`
   strsceventsOFF=`echo "config sc-events off" | xxd -p -c 256`
   strsceventsON=`echo "config sc-events on" | xxd -p -c 256`

   python3 unsafeprompt.py -p -e $strexit,$strimport,$strsceventsON,$strshowwallet,$strrebuild,$stropen,$strsceventsOFF

   echo "IMPORT OUTPUT:"
   cat $lhash.import
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK RmFsc2UK
#outside: docker exec -t neo-privnet-with-gas dash -i -c "./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK RmFsc2UK" > saida.log
