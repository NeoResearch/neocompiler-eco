#!/bin/bash
#
# This script starts four consensus, and one Python RPC/REST client, and waits forever
#

screen -L -Logfile /opt/node1.log -dmS node1 expect /opt/start_consensus_node.sh /opt/node1/neo-cli/ wallet1.json one
screen -L -Logfile /opt/node2.log -dmS node2 expect /opt/start_consensus_node.sh /opt/node2/neo-cli/ wallet2.json two
screen -L -Logfile /opt/node3.log -dmS node3 expect /opt/start_consensus_node.sh /opt/node3/neo-cli/ wallet3.json three
screen -L -Logfile /opt/node4.log -dmS node4 expect /opt/start_consensus_node.sh /opt/node4/neo-cli/ wallet4.json four

sleep 5

service cron restart

# (cd /opt/node1/neo-cli/; dotnet neo-cli.dll --rpc)

sleep infinity
