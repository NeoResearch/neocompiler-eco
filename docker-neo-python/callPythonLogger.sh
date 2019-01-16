#!/bin/bas
echo "(PYTHON-LOGGER SCRIPT)"
rm -rf /root/.neopython/

#screen -L -Logfile /neo-python/pythonScreen.log -dmS neolog python3.6  /neo-python/neo/bin/prompt.py -p
screen -L -dmS neolog python3.6  /neo-python/neo/bin/prompt.py -p
#sleep 3
#screen -r neolog -X colon "logfile flush 2^M"

sleep 5
screen -S neolog -p 0 -X stuff "config sc-events on^M"

sleep infinity
