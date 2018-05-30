#!/bin/bash

echo "Calling python invoke procedures..."

if (( $# != 6 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]"
	echo "2 - HASH, import contract 3-5. Example: param --attach-neo --attach-gas testInvolyOnly "

else
	PYTHON_PATH=`echo "$1" | base64 --decode`
	echo "Path is: " + $PYTHON_PATH
	cd /$PYTHON_PATH
	lhash=`echo "$2" | base64 --decode`
	parm=`echo $3 | base64 --decode`
	neo=`echo "$4" | base64 --decode`
	gas=`echo "$5" | base64 --decode`
  	onlyinvoke=`echo "$6" | base64 --decode`

  	if [ "$onlyinvoke" -eq "0" ]; then
      		invokeCall=`echo "testinvoke"`
  	else
  		invokeCall=`echo "testinvokeonly"`
  	fi

    attachneo="--attach-neo=$neo"
   	if [ "$neo" -eq "0" ]; then
   		attachneo=""
  	fi

		attachgas="--attach-gas=$gas"
   	if [ "$gas" -eq "0" ]; then
   		attachgas=""
  	fi

		echo "$invokeCall $lhash $parm $attachneo $attachgas"
    strinvoke="$invokeCall $lhash $parm $attachneo $attachgas"

	#============================================================================================
	# cleaning screen
	rm /$PYTHON_PATH/pythonScreen.log
	#============================================================================================

	#============================================================================================
	# event on - otherwise notify would not be reported
	screen -S $PYTHON_PATH -p 0 -X stuff "config sc-events on^M"
	sleep 0.5
	#============================================================================================

  # ========================================= DISPLAY WALLET BALANCE ==========================
	screen -S $PYTHON_PATH -p 0 -X stuff "wallet^M"
	sleep 0.5

	#============================================================================================
	echo "calling python for invoking with " + $strinvoke
	screen -S $PYTHON_PATH -p 0 -X stuff "$strinvoke^M"
	sleep 0.5

	#password for broadcasting tx (or not, in case of testinvokeonly)
	if [ "$onlyinvoke" -eq "0" ]; then
      		screen -S $PYTHON_PATH -p 0 -X stuff "coz^M"
  	else
  		screen -S $PYTHON_PATH -p 0 -X stuff "hehehehe^M"
  	fi

	#============================================================================================
	# event off - otherwise the screen would receive everything
	screen -S $PYTHON_PATH -p 0 -X stuff "config sc-events off^M"
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
	# Drastic solution to unicode problems... removing all control chars! (TODO: keep line break)
	cat /$PYTHON_PATH/pythonScreen.log | tr -d '[:cntrl:]'
	#============================================================================================

	#============================================================================================
	# cleaning screen
	rm /$PYTHON_PATH/pythonScreen.log
	#============================================================================================
fi
