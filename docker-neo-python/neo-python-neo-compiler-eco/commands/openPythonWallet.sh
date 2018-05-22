#!/bin/bash

if (( $# != 3 )); then
	echo "WRONG Parameter. Pass: [Screen name] [wallet] [password]";
else
	PYTHON_PATH=$1
	echo "Path is " + $1 + " or : " + $PYTHON_PATH

	cp -r /neo-python /$PYTHON_PATH
	rm -rf /root/.$PYTHON_PATH

	screen -dmS $PYTHON_PATH python3.6  /$PYTHON_PATH/neo/bin/prompt.py -p --datadir /root/.$PYTHON_PATH/Chains

	sleep 3
	screen -S $PYTHON_PATH -p 0 -X stuff "config sc-events off^M"
	sleep 1
	screen -S $PYTHON_PATH -p 0 -X stuff "open wallet $2^M"
	sleep 1
	screen -S $PYTHON_PATH -p 0 -X stuff "$3^M"
	sleep 1
	screen -S $PYTHON_PATH -p 0 -X stuff "wallet rebuild^M"
fi

#screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -dmS $PYTHON_SCREEN python3.6  /$PYTHON_PATH/neo/bin/prompt.py -p --datadir /root/.$PYTHON_PATH/Chains
#screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_SCREEN -p 0 -X stuff "wallet rebuild^M"
