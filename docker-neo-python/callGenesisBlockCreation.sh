#!/bin/bash
echo "WAITING 10 seconds to let consensus nodes start..."
sleep 10

echo "CALLING genesis block creating with neo-python..."
screen -dmS genesisBlockWithPython python3.6 /neo-python/claim_neo_and_gas_fixedwallet.py
