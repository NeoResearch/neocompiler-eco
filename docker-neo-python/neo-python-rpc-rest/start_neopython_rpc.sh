#!/bin/bash
echo "(PYTHON-RPC SCRIPT) - WAITING 4 seconds to let consensus nodes start..."
sleep 4

rm -rf /root/.neopython/
screen -L -Logfile /neo-python/logs/rpcScreen.log -dmS rpcScreen /usr/bin/python3 /neo-python/neo/bin/api_server.py --privnet --logfile /neo-python/logs/saida_rpc.log  --port-rpc 10332
sleep infinity
