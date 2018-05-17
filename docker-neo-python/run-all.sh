#!/bin/bash
# It merges the run of rpc-rest and neo-compiler eco privatenet scripts
# This script starts neo Python RPC/REST client, and sync eco wallets and waits forever
#

#Calling genesis block creation
#/opt/callGenesisBlockCreation.sh
screen -dmS pythonGenesisBlock /opt/callGenesisBlockCreation.sh

#Current on 30337 and 38088
screen -dmS pythonRestRPC /opt/start_neopython_rpc_rest.sh

#This screen keeps neo-python open after rebuild on w1.wallet
#TODO - Improve this to be called on NeoCompiler. Then, different wallets could be sync when users fell that they are not.
screen -dmS pythonSyncing /neo-python/execSleepNeopyInfinitSync.sh

sleep infinity
