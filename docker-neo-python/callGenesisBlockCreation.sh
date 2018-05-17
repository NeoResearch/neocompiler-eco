#!/bin/bash
echo "WAITING 10 seconds to let consensus nodes start..."
sleep 10


cp -r /neo-python/ /neo-python-genesis-creation

echo "CALLING genesis block creating with neo-python..."
python3.6 /neo-python-genesis-creation/claim_neo_and_gas_fixedwallet.py

rm -rf /neo-python-genesis-creation

#screen -dmS genesisBlockWithPython python3.6 /neo-python-genesis-creation/claim_neo_and_gas_fixedwallet.py
