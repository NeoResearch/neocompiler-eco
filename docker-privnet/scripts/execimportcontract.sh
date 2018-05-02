#!/bin/bash

# $1 == HASH
# import contract $2 $3 $4 $5 $6
# import contract hash.avm "params" 01 False False
# $7 == w1.wallet


if (( $# == 7 )); then
   #cd /neo-python/
   export randomFolder=$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 32)
   cp -r /neo-python/ /neo-python$randomFolder
   #cp -r /opt/node1/neo-cli/Chain /neo-python$randomFolder/Chains/privnet
   cd /neo-python$randomFolder

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

   echo "open: $stropen"
   strimport=`echo "import contract $lhash.avm $parm $rv $op1 $op2" | xxd -p -c 256`
   #echo "open: $strimport"
   strexit=`echo "exit" | xxd -p`
   strsceventsOFF=`echo "config sc-events off" | xxd -p -c 256`
   strsceventsON=`echo "config sc-events on" | xxd -p -c 256`

   #rm $lhash.import
   echo "calling python for deploy"
#   python3.6 unsafeprompt.py -p -e $strexit,$strimport,$strsceventsON,$strshowwallet,$strrebuild,$stropen,$strsceventsOFF
   python3.6 unsafeprompt.py -p -e $strexit,$strimport,$strsceventsON,$strshowwallet,$stropen,$strsceventsOFF

#   echo "Time to delete folder"
   rm -rf /neo-python$randomFolder/
   echo "Bye bye - deploy script :D"
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK RmFsc2UK
#outside: docker exec -t neo-privnet-with-gas dash -i -c "./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo= MDBjNTZiNjE2Yzc1NjYK IiIK MDEK RmFsc2UK RmFsc2UK" > saida.log
