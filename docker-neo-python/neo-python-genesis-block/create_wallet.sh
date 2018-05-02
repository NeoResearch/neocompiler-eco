#!/bin/bash
CONTAINER_NAME="neo-csharp-nodes"

echo "Starting script to claim NEO and GAS..."
CLAIM_CMD="python3.6 /neo-python/claim_neo_and_gas_fixedwallet.py"
DOCKER_CMD="docker exec -it $CONTAINER_NAME ${CLAIM_CMD}"
echo $DOCKER_CMD
echo
($DOCKER_CMD)

echo
echo "Copying wallet file and wif key out of Docker container..."
docker cp $CONTAINER_NAME:/tmp/wif ./neo-privnet.wif
docker cp $CONTAINER_NAME:/tmp/wallet ./neo-privnet.wallet

echo
echo "--------------------"
echo
echo "All done! You now have 2 files in the current directory:"
echo
echo "  $CONTAINER_NAME.wallet .. a wallet you can use with neo-python (pwd: coz)"
echo "  $CONTAINER_NAME.wif ..... a wif private key you can import into other clients"
echo
echo "Enjoy!"
