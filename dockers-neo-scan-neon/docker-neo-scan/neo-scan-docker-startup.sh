#!/bin/bash

echo "WAITING Time to sleep a little bit before starting server configurations"
sleep 10

echo "ENTERING into /data"
cd /data

echo "RUNNING mix deps.get..."
mix deps.get

echo "RUNNING mix ecto.create and migrate..."
mix ecto.create && mix ecto.migrate

echo "RUNNING npm install..."
(cd ./apps/neoscan_web/assets; npm install)

echo "CHECKING Nodes and Rest and RUNNING mix phx.server..."
/opt/init-neo-scan.sh
