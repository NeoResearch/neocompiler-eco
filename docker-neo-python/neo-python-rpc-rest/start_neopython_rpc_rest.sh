#!/bin/bash
cp -r /neo-python/ /neo-rpc-rest
cd /neo-rpc-rest/neo/bin/
rm -rf /root/.neopythonrestrpc/Chains/*
rm -rf /root/.neopythonrestrpc/*
rm -rf /root/.neopythonrestrpc
#rm -rf /root/.neopython/Chains/*
#rm -rf /root/.neopython/*

./api_server.py --datadir /root/.neopythonrestrpcc/Chains --privnet --port-rpc 30337 --port-rest 38088
