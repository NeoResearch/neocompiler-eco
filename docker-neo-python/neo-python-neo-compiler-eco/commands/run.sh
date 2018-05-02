#!/bin/bash
#This screen keeps neo-python open after rebuild on w1.wallet
#TODO - Improve this to be called on NeoCompiler. Then, different wallets could be sync when users fell that they are not.
screen -dmS pythonSyncing /neo-python/execSleepNeopyInfinitSync.sh

sleep infinity
