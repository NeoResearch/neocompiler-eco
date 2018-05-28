#!/bin/bash

#ln -s /root/.neopython/prompt.log /neo-python/logs2/prompt.log

rm -rf /root/.neopython/

screen -L -Logfile /neo-python/pythonScreen.log -dmS neolog python3.6  /neo-python/neo/bin/prompt.py -p --datadir /root/.neo-python/
sleep 3
screen -r neolog -X colon "logfile flush 2^M"

sleep 5
screen -S neolog -p 0 -X stuff "config sc-events on^M"

sleep infinity

#/opt/openPythonWallet.sh pythonW2 w2.wallet coz
