#!/bin/bash

# $1 == HASH
# import contract $2 $3 $4 $5 $6
# import contract hash.avm "params" 01 False False


if (( $# != 6 )); then
	echo "WRONG Parameter. Pass: [1 - Screen name]";
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
   	   strinvoke=`echo "$invokeCall $lhash $parm^M" | xxd -p -c 256`
  	else
    	  echo "$invokeCall $lhash $parm --attach-neo=$neo";
    	  strinvoke=`echo "$invokeCall $lhash $parm --attach-neo=$neo^M" | xxd -p -c 256`
        fi

	echo "calling python for invoking with " + $strinvoke
	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_SCREEN -p 0 -X stuff $strinvoke
fi
