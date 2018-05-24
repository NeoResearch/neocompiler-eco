#!/bin/bash
PYTHON_RPC_FOLDER=neo-python-rpc-rest
rm -rf /root/.$PYTHON_RPC_FOLDER
rm -rf /$PYTHON_RPC_FOLDER
cp -r /neo-python/ /$PYTHON_RPC_FOLDER


#/$PYTHON_RPC_FOLDER/neo/bin/api_server.py --datadir /root/.$PYTHON_RPC_FOLDER/Chains --privnet --port-rpc 30337 --port-rest 38088

#RPC is not being used and causing bug
/usr/bin/python3 /$PYTHON_RPC_FOLDER/neo/bin/api_server.py --datadir /root/.$PYTHON_RPC_FOLDER/Chains --privnet --port-rest 8080
