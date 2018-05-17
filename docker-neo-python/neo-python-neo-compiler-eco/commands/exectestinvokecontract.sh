#!/bin/bash

# $1 == HASH
# $2 == PARAMS
# testinvoke $1 $2
# $3 == WALLET

if (( $# == 5 )); then
   export randomFolder=$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 32)
   cp -r /neo-python/ /neo-python$randomFolder
   cd /neo-python$randomFolder

   wallet=`echo "$4" | base64 --decode`
   neo=`echo "$3" | base64 --decode`
   parm=`echo $2 | base64 --decode`
   lhash=`echo "$1" | base64 --decode`
   onlyinvoke=`echo "$5" | base64 --decode`
   #echo "onlyinvoke: $onlyinvoke"
   #echo "HASH: $lhash"
   #echo "code: $2"
   stropen=`echo "open wallet $wallet" | xxd -p`
   strrebuild=`echo "wallet rebuild" | xxd -p`
   strshowwallet=`echo "wallet" | xxd -p`
   strexit=`echo "exit" | xxd -p`

   if [ "$onlyinvoke" -eq "0" ]; then
      invokeCall=`echo "testinvoke"`
   else
      invokeCall=`echo "testinvokeonly"`
   fi
    
   if [ "$neo" -eq "0" ]; then
      echo "$invokeCall $lhash $parm";
      strinvoke=`echo "$invokeCall $lhash $parm" | xxd -p -c 256`
   else
      echo "$invokeCall $lhash $parm --attach-neo=$neo";
      strinvoke=`echo "$invokeCall $lhash $parm --attach-neo=$neo" | xxd -p -c 256`
   fi
   echo "final call is: $strinvoke"

   strsceventsOFF=`echo "config sc-events off" | xxd -p -c 256`
   strsceventsON=`echo "config sc-events on" | xxd -p -c 256`

   #rm $lhash.invoke
   
   echo "calling python for invoke"
#   python3.6 unsafeprompt.py -p -e $strexit,$strinvoke,$strsceventsON,$strshowwallet,$strrebuild,$stropen,$strsceventsOFF
   python3.6 unsafeprompt.py -p --datadir /root/.$randomFolder/Chains -e $strexit,$strinvoke,$strsceventsON,$strshowwallet,$stropen,$strsceventsOFF

#   echo "Time to delete folder"
   rm -rf /neo-python$randomFolder/
   rm -rf /root/.$randomFolder
   echo "Bye bye - invoke script :D"
fi

#example: ./execimportcontract.sh M2ZlMTY2ZTczMzIwYTVlZDNmZTg0YTFkNjhlMmRlMmE2YTk1YmJiZAo=
