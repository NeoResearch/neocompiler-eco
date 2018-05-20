#!/bin/bash

#Delete all previous data
rm -rf /root/.neopython/Chains/*
rm -rf /root/.neopython

cd /neo-python/ 

stropen[1]=`echo "open wallet w1.wallet" | xxd -p`
stropen[2]=`echo "open wallet w2.wallet" | xxd -p`
stropen[3]=`echo "open wallet w3.wallet" | xxd -p`
stropen[4]=`echo "open wallet w4.wallet" | xxd -p`
strrebuild=`echo "wallet rebuild 1" | xxd -p`
strexit=`echo "exit" | xxd -p`
strstate=`echo "state" | xxd -p`

for i in `seq 1 4`
do
    rm -rf /root/.neopython
    python3.6 unsafeprompt.py -p -e $strexit,$strrebuild,${stropen[i]}
    sleep 2
done

<<"COMMENT"
callTransfer=true
while [ 1 ]
do
        #TODO it lead to problem because all time CMD runs it starts   
        #Transfer funds to all 4 wallet after first sync round  
	#if  [ "$callTransfer" = true ]
	#then
        #    callTransfer=false	
	#    /neo-python/execTransferFundsAtTheBegin.sh
	#fi

	for i in `seq 1 4`
	do
	    rm -rf /root/.neopython
	    python3.6 unsafeprompt.py -p -e $strexit,$strstate,${stropen[i]},$strstate
	    sleep 3
	done
done
COMMENT
