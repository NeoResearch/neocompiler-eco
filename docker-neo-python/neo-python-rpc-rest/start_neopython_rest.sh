#!/bin/bash
echo "(PYTHON-REST SCRIPT) - WAITING 3 seconds to let consensus nodes start..."
sleep 3


#PYTHON_RPC_FOLDER=neo-python-rpc-rest
#rm -rf /root/.$PYTHON_RPC_FOLDER
#rm -rf /$PYTHON_RPC_FOLDER
#cp -r /neo-python/ /$PYTHON_RPC_FOLDER

rm -rf /root/.neopython/

#mkdir /neo-python/logs
#rm -f /neo-python/logs/*.log

##/$PYTHON_RPC_FOLDER/neo/bin/api_server.py --datadir /root/.$PYTHON_RPC_FOLDER/Chains --privnet --port-rpc 30337 --port-rest 38088

#RPC is not being used and causing bug
#/usr/bin/python3 /$PYTHON_RPC_FOLDER/neo/bin/api_server.py --datadir /root/.$PYTHON_RPC_FOLDER/ --privnet --logfile /neo-python-rpc-rest/saida.log --port-rpc 10332 --port-rest 8080 

screen -L -Logfile /neo-python/logs/restScreen.log -dmS restScreen /usr/bin/python3 /neo-python/neo/bin/api_server.py --privnet --logfile /neo-python/logs/saida.log  --port-rest 8080 

sleep infinity

#/usr/bin/python3 /$PYTHON_RPC_FOLDER/neo/bin/api_server.py --datadir /root/.$PYTHON_RPC_FOLDER/ --privnet --port-rest 8080
