#!/bin/bash

if (( $# != 7 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]"
	echo "2 - HASH, import contract 3-7. Example: import contract hash.avm params 01 False False"

else
	PYTHON_PATH=`echo "$1" | base64 --decode`
	echo "Path is " + $1 + " or : " + $PYTHON_PATH
	
	lhash=`echo "$2" | base64 --decode`
	echo "HASH: $lhash"
	echo "code: $3"
	echo "$3" | base64 --decode | xxd -p -r > $lhash.avm
	parm=`echo $4 | base64 --decode`
	rv=`echo $5 | base64 --decode`
	rv=`echo \"$rv\"`
	op1=`echo $6 | base64 --decode`
	op2=`echo $7 | base64 --decode`
	strimport="import contract $lhash.avm $parm $rv $op1 $op2^M"

	cp $lhash.avm /$PYTHON_PATH

	rm /$PYTHON_PATH/pythonScreen.log
	echo "calling python for deploy with " + $strimport
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "$strimport"
	sleep 0.5
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "coz^M"

	#screen -L -Logfile /pythonW1/pythonScreen.log -S pythonW1 -p 0 -X stuff "wallet^M"

        #TODO - MAYBE Run a WHILE that checks if file exists
	echo "Maybe remove this sleep"
	sleep 2
	cat /$PYTHON_PATH/pythonScreen.log
fi
