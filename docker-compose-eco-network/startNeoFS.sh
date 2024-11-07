#!/bin/bash

NEO_GO_BINARY_VERSION=v0.106.3
NEOFS_CLI_BINARY_VERSION=v0.43.0
NEOFS_ADM_BINARY_VERSION=v0.43.0
NEOFS_CONTRACTS_VERSION=v0.20.0

NEOFS_MAIN_CHAIN_SERVICE_NAME=neofs-main-chain
NEOFS_MAIN_CHAIN_RPC_ENDPOINT=http://localhost:5000
NEOFS_STORAGE_NODE_RPC_ENDPOINT=localhost:5005
NEOFS_STORAGE_NODE_GRPC_ENDPOINT=neofs-storage-node:5006
MULTIPURPOSE_WALLET_ADDRESS=NbUgTSFvPmsRxmGeWpuuGeJUoRoi6PErcM
MULTISIG_ACCOUNT_ADDRESS=NforeidHBjJDK6sGdxiAMRfQwW8UnkwMFm
NEOFS_INNERRING_SERVICE_NAME=neofs-innerring
NEOFS_STORAGE_NODE_SERVICE_NAME=neofs-storage-node
NEOFS_CONTRACT_ADDRESS=NNT3JzjNC5pnkNxCDTqJuUNnrarDGu5pFM

echo "download neofs binaries and contracts"

curl -sSL "https://github.com/nspcc-dev/neo-go/releases/download/$NEO_GO_BINARY_VERSION/neo-go-linux-amd64" -o NeoFS/neo-go
curl -sSL "https://github.com/nspcc-dev/neofs-node/releases/download/$NEOFS_CLI_BINARY_VERSION/neofs-cli-linux-amd64" -o NeoFS/neofs-cli
curl -sSL "https://github.com/nspcc-dev/neofs-node/releases/download/$NEOFS_ADM_BINARY_VERSION/neofs-adm-linux-amd64" -o NeoFS/neofs-adm
curl -sSL "https://github.com/nspcc-dev/neofs-contract/releases/download/$NEOFS_CONTRACTS_VERSION/neofs-contract-$NEOFS_CONTRACTS_VERSION.tar.gz" -o NeoFS/neofs-contract.tar.gz
mkdir NeoFS/neofs-contract
tar -xf NeoFS/neofs-contract.tar.gz -C NeoFS/neofs-contract --strip-components 1 
chmod 755 NeoFS/neofs-cli
chmod 755 NeoFS/neofs-adm
chmod 755 NeoFS/neo-go

echo "start $NEOFS_MAIN_CHAIN_SERVICE_NAME service"
docker-compose -f NeoFS/chain/docker-compose.yml up -d
until [ "$(docker inspect --format='{{.State.Health.Status}}' $NEOFS_MAIN_CHAIN_SERVICE_NAME)" == "healthy" ]; do
  echo "Waiting for $NEOFS_MAIN_CHAIN_SERVICE_NAME to become healthy..."
  sleep 5
done
echo "$NEOFS_MAIN_CHAIN_SERVICE_NAME is healthy! keep going..."

echo "deploy neofs contract"
echo "transfer some money first for the contract deployment"
docker exec $NEOFS_MAIN_CHAIN_SERVICE_NAME neo-go wallet nep17 transfer --out transfer_tx.json --token 'GAS' --to "$MULTIPURPOSE_WALLET_ADDRESS" --rpc-endpoint "$NEOFS_MAIN_CHAIN_RPC_ENDPOINT" --wallet-config '/wallets/neo-wallet1-config.yml' --from "$MULTISIG_ACCOUNT_ADDRESS" --amount 9000
docker exec $NEOFS_MAIN_CHAIN_SERVICE_NAME neo-go wallet sign --in transfer_tx.json --out transfer_tx2.json --wallet-config '/wallets/neo-wallet2-config.yml' --address "$MULTISIG_ACCOUNT_ADDRESS"
docker exec $NEOFS_MAIN_CHAIN_SERVICE_NAME neo-go wallet sign --in transfer_tx2.json --wallet-config '/wallets/neo-wallet3-config.yml' --address "$MULTISIG_ACCOUNT_ADDRESS" --rpc-endpoint  "$NEOFS_MAIN_CHAIN_RPC_ENDPOINT" --await
echo "and now actually deploy the contract"
docker exec $NEOFS_MAIN_CHAIN_SERVICE_NAME neo-go contract deploy --manifest '/neofs-contract/neofs/manifest.json' --rpc-endpoint  "$NEOFS_MAIN_CHAIN_RPC_ENDPOINT" --wallet-config '/wallets/multipurpose-wallet-config.yml' --force --timeout '10s' --in '/neofs-contract/neofs/contract.nef' [ true ffffffffffffffffffffffffffffffffffffffff [ 02b3622bf4017bdfe317c58aed5f4c753f206b7db896046fa7d774bbc4bf7f8dc2 ] [ InnerRingCandidateFee 10000000000 WithdrawFee 10000000000 ] ]
echo "neofs contract deployed"

echo "start $NEOFS_INNERRING_SERVICE_NAME service"
docker-compose -f NeoFS/ir/docker-compose.yml up -d
until [ "$(docker inspect --format='{{.State.Health.Status}}' $NEOFS_INNERRING_SERVICE_NAME)" == "healthy" ]; do
  echo "Waiting for $NEOFS_INNERRING_SERVICE_NAME to become healthy..."
  sleep 5
done
echo "$NEOFS_INNERRING_SERVICE_NAME is healthy! keep going..."

echo "add some money to neofs storage node wallet"
./NeoFS/neofs-adm -c ./NeoFS/neofs-adm.yml morph refill-gas --storage-wallet ./NeoFS/sn/wallet01.json --gas 10.0 --alphabet-wallets ./NeoFS/ir

echo "start $NEOFS_STORAGE_NODE_SERVICE_NAME service"
docker-compose -f NeoFS/sn/docker-compose.yml up -d
until [ "$(docker inspect --format='{{.State.Health.Status}}' $NEOFS_INNERRING_SERVICE_NAME)" == "healthy" ]; do
  echo "Waiting for $NEOFS_INNERRING_SERVICE_NAME to become healthy..."
  sleep 5
done
echo "$NEOFS_STORAGE_NODE_SERVICE_NAME is health! keep going..."
echo "wait a minute until storage node is bootstrapping"
sleep 60
echo "tick new epoch to speed up storage node bootstrapping"
./NeoFS/neofs-adm -c ./NeoFS/neofs-adm.yml morph force-new-epoch --alphabet-wallets ./NeoFS/ir
until docker exec neofs-storage-node /neofs-cli control healthcheck -c /cli-cfg.yml --endpoint $NEOFS_STORAGE_NODE_GRPC_ENDPOINT | grep -q "Network status: ONLINE"; do
  echo "Waiting for network status to be ONLINE..."
  sleep 5
done
echo "$NEOFS_STORAGE_NODE_SERVICE_NAME is ONLINE! Lets create containers and objects"

echo "transfer some money to the neofs contract"
docker exec $NEOFS_MAIN_CHAIN_SERVICE_NAME neo-go wallet nep17 transfer --token 'GAS' --to "$NEOFS_CONTRACT_ADDRESS" --rpc-endpoint "$NEOFS_MAIN_CHAIN_RPC_ENDPOINT" --wallet-config '/wallets/multipurpose-wallet-config.yml' --from "$MULTIPURPOSE_WALLET_ADDRESS" --amount 100 --await --force

echo "create container"
container_id=$(docker exec neofs-storage-node /neofs-cli --config /wallets/multipurpose-wallet-config.yml container create --rpc-endpoint "$NEOFS_STORAGE_NODE_RPC_ENDPOINT" --wallet /wallets/multipurpose-wallet.json --await --policy 'REP 1' | grep -oP "(?<=container ID: ).*")
echo "Container ID: $container_id"

echo "upload object"
docker exec neofs-storage-node /neofs-cli --config /wallets/multipurpose-wallet-config.yml object put --cid "$container_id" --file /wallets/multipurpose-wallet-config.yml --no-progress --timeout '60s' --rpc-endpoint "$NEOFS_STORAGE_NODE_RPC_ENDPOINT" --wallet /wallets/multipurpose-wallet.json
echo "we are done!"
