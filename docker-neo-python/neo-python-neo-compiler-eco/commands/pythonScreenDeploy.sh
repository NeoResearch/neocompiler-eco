#!/bin/bash

echo "Calling python deploy procedures..."

if (( $# != 7 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]"
	echo "2 - HASH, import contract 3-7. Example: import contract hash.avm params 01 False False"

else
	PYTHON_PATH=`echo "$1" | base64 --decode`
	echo "Path is: " + $PYTHON_PATH
	cd /$PYTHON_PATH
	lhash=`echo "$2" | base64 --decode`
	echo "HASH: $lhash"
	echo "code: $3"
	echo "$3" | base64 --decode | xxd -p -r > /$PYTHON_PATH/$lhash.avm
	parm=`echo $4 | base64 --decode`
	rv=`echo $5 | base64 --decode`
	op1=`echo $6 | base64 --decode`
	op2=`echo $7 | base64 --decode`
	strimport="import contract /$PYTHON_PATH/$lhash.avm $parm $rv $op1 $op2"

	#============================================================================================
	# cleaning screen
	rm /$PYTHON_PATH/pythonScreen.log
	#============================================================================================

	#============================================================================================
	echo "calling python for deploy with " + $strimport
	screen -S $PYTHON_PATH -p 0 -X stuff "$strimport^M"	
	sleep 0.5

	#name, version, author, email, description
	for i in `seq 1 5`
	do
		screen -S $PYTHON_PATH -p 0 -X stuff "^M"
		sleep 0.5
	done

	#password for broadcasting tx
	screen -S $PYTHON_PATH -p 0 -X stuff "coz^M"
	sleep 0.5

	#name, version, author, email, description
	for i in `seq 1 2`
	do
		screen -S $PYTHON_PATH -p 0 -X stuff "^M"
		sleep 0.5
	done

	#============================================================================================

	#============================================================================================
        #TODO - MAYBE Run a WHILE that checks if file exists
	echo "Maybe remove this sleep"
	sleep 4
	#============================================================================================

	#============================================================================================
	#Printing the log, hopefully, already flushed by the screen
	cat /$PYTHON_PATH/pythonScreen.log
	#============================================================================================

	#============================================================================================
	# cleaning screen
	rm /$PYTHON_PATH/pythonScreen.log
	#============================================================================================
fi
