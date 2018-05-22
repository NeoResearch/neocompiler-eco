#!/bin/bash

if (( $# != 6 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]"
	echo "2 - HASH, import contract 3-7. Example: testinvoke(only) --attach-neo testInvolyOnly "

else
	PYTHON_PATH=`echo "$1" | base64 --decode`
	echo "Path is " + $1 + " or : " + $PYTHON_PATH
	
	lhash=`echo "$2" | base64 --decode`
	parm=`echo $3 | base64 --decode`
	neo=`echo "$4" | base64 --decode`
  	onlyinvoke=`echo "$5" | base64 --decode`

	# TODO - testinvokeonly will not work now! We need to modify some little things
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

	cp $lhash.avm /$PYTHON_PATH

	rm /$PYTHON_PATH/pythonScreen.log

	echo "calling python for invoking with " + $strinvoke
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff $strinvoke
	sleep 0.5
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_PATH -p 0 -X stuff "coz^M"

        #TODO - MAYBE Run a WHILE that checks if file exists
	echo "Maybe remove this sleep"
	sleep 2
	cat /$PYTHON_PATH/pythonScreen.log
fi
