#!/bin/bash
echo "(PYTHON-RPC SCRIPT) WAITING until consensus nodes can send respond an API/RPC call (i. e. consensus nodes already started)"
/opt/waitNodes.sh

rm -rf /root/.neopython/
screen -L -Logfile /neo-python/logs/rpcScreen.log -dmS rpcScreen /usr/bin/python3 /neo-python/neo/bin/api_server.py --privnet --logfile /neo-python/logs/saida_rpc.log  --port-rpc 10332
sleep infinity
