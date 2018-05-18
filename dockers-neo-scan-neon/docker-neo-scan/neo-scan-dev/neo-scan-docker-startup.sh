#!/bin/bash

echo ""
echo "WAITING Time to sleep a little bit before starting server configurations"
echo ""

sleep 5

#echo "RUNNING mix deps.get..."
#cd /neoscan && mix deps.get

echo "RUNNING mix ecto.create and migrate..."
cd /neoscan && mix ecto.create && mix ecto.migrate

#echo "RUNNING npm install..."
#(cd /neoscan/apps/neoscan_web/assets; npm install)

echo "CHECKING Nodes and Rest and RUNNING mix phx.server..."
/opt/init-neo-scan.sh
