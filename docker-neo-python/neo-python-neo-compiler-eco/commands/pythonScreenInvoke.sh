#!/bin/bash

echo "Calling python invoke procedures..."

if (( $# != 5 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]"
	echo "2 - HASH, import contract 3-5. Example: param --attach-neo testInvolyOnly "

else
	PYTHON_PATH=`echo "$1" | base64 --decode`
	lhash=`echo "$2" | base64 --decode`
	parm=`echo $3 | base64 --decode`
	neo=`echo "$4" | base64 --decode`
  	onlyinvoke=`echo "$5" | base64 --decode`

	echo "Path is " + $1 + " or : " + $PYTHON_PATH

  	if [ "$onlyinvoke" -eq "0" ]; then
      	    invokeCall=`echo "testinvoke"`
  	else
  	    invokeCall=`echo "testinvokeonly"`
  	fi
  	 
   	if [ "$neo" -eq "0" ]; then
   	   echo "$invokeCall $lhash $parm";
   	   strinvoke="$invokeCall $lhash $parm^M"
  	else
    	  echo "$invokeCall $lhash $parm --attach-neo=$neo";
    	  strinvoke="$invokeCall $lhash $parm --attach-neo=$neo^M"
        fi

	#============================================================================================
	# cleaning screen
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "^M"
	sleep 0.5
	rm /$PYTHON_PATH/pythonScreen.log
	#============================================================================================

	#============================================================================================
	echo "calling python for invoking with " + $strinvoke
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "$strinvoke"
	sleep 0.5

	#password for broadcasting tx (or not, in case of testinvokeonly)
	if [ "$onlyinvoke" -eq "0" ]; then
      	    screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "coz^M"
  	else
  	    screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "hehehehe^M"
  	fi
	#============================================================================================


	#============================================================================================
        #TODO - MAYBE Run a WHILE that checks if file exists
	echo "Maybe remove this sleep"
	sleep 2
	#============================================================================================

	cat /$PYTHON_PATH/pythonScreen.log
fi
