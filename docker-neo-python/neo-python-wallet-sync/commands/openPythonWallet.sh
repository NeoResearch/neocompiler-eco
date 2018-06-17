#!/bin/bash
echo "Expects three parameters: PYTHON_WALLET=w1.wallet, PYTHON_NAME=pythonW1, PYTHON_PWD=coz"
echo "(PYTHON-ECO WALLETS SYNCING) WAITING until consensus nodes can send respond an API/RPC call (i. e. consensus nodes already started)"
/opt/waitNodes.sh


#if (( $# != 3 )); then
#	echo "WRONG Parameter. Pass: [Screen name] [wallet] [password]";
#else
	PYTHON_PATH=$PYTHON_NAME
	echo "A syncronous wallet will be oppened at:" + $PYTHON_PATH

	cp -r /neo-python /$PYTHON_PATH
	rm -rf /root/.neopython/
	rm -rf /root/.$PYTHON_PATH

	screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -dmS $PYTHON_PATH python3.6  /$PYTHON_PATH/neo/bin/prompt.py -p --datadir /root/.$PYTHON_PATH/
	sleep 6

	screen -r $PYTHON_PATH -X colon "logfile flush 2^M"

	sleep 3
	screen -S $PYTHON_PATH -p 0 -X stuff "config sc-events off^M"
	sleep 3
	screen -S $PYTHON_PATH -p 0 -X stuff "open wallet $PYTHON_WALLET^M"
	sleep 3
	screen -S $PYTHON_PATH -p 0 -X stuff "$PYTHON_PWD^M"
	sleep 3
	screen -S $PYTHON_PATH -p 0 -X stuff "wallet rebuild^M"

sleep infinity

#fi

#screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -dmS $PYTHON_SCREEN python3.6  /$PYTHON_PATH/neo/bin/prompt.py -p --datadir /root/.$PYTHON_PATH/Chains
#screen -L -Logfile /$PYTHON_PATH/pythonScreen.log -S $PYTHON_SCREEN -p 0 -X stuff "wallet rebuild^M"
