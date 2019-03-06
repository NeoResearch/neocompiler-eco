#!/bin/bash
echo "(PYTHON-REST SCRIPT) WAITING until consensus nodes can send respond an API/RPC call (i. e. consensus nodes already started)"
/opt/waitNodes.sh

rm -rf /root/.neopython/

# screen -L -Logfile /neo-python/logs/restScreen.log -dmS restScreen /usr/bin/python3 /neo-python/neo/bin/api_server.py --privnet --logfile /neo-python/logs/saida.log  --port-rest 8080 
screen -L -dmS restScreen /usr/bin/python3 /neo-python/neo/bin/api_server.py --privnet --port-rest 8080 

sleep infinity
