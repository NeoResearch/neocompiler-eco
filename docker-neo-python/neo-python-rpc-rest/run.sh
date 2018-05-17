#!/bin/bash
#
# This script starts neo Python RPC/REST client and waits forever
#

#Current on 30337 and 38088
screen -dmS pythonRestRPC /opt/start_neopython_rpc_rest.sh

sleep infinity
