#!/bin/bash

docker-compose -f NeoFS/chain/docker-compose.yml down
docker-compose -f NeoFS/ir/docker-compose.yml down
docker-compose -f NeoFS/sn/docker-compose.yml down
docker volume rm ir_neofs_chain_inner_ring
docker volume rm sn_neofs_storage
rm NeoFS/neofs-contract.tar.gz
rm -rf NeoFS/neofs-contract
rm NeoFS/neofs-cli
rm NeoFS/neofs-adm
rm NeoFS/neo-go
