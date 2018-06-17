#!/bin/bash
echo "WAITING until consensus nodes can send respond an API/RPC call (i. e. consensus nodes already started)"
/opt/waitNodes.sh

GENESIS_BLOCK_DIR=neo-python-genesis-creation

rm -rf /$GENESIS_BLOCK_DIR
rm -rf /root/.$GENESIS_BLOCK_DIR

cp -r /neo-python/ /$GENESIS_BLOCK_DIR

echo "CALLING genesis block creating with neo-python..."
python3.6 /$GENESIS_BLOCK_DIR/claim_neo_and_gas_fixedwallet.py --datadir /root/.$GENESIS_BLOCK_DIR/Chains --privnet

rm -rf /$GENESIS_BLOCK_DIR
rm -rf /root/.$GENESIS_BLOCK_DIR

#screen -dmS genesisBlockWithPython python3.6 /neo-python-genesis-creation/claim_neo_and_gas_fixedwallet.py
