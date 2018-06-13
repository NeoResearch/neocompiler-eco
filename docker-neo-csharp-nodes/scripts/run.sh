#!/bin/bash
#
# This script starts four consensus, and one Python RPC/REST client, and waits forever
#

screen -L -Logfile /opt/node1RPC.log -dmS node1RPC expect /opt/start_rpc_node.sh /opt/node1RPC/neo-cli/
screen -L -Logfile /opt/node2RPC.log -dmS node2RPC expect /opt/start_rpc_node.sh /opt/node2RPC/neo-cli/

screen -L -Logfile /opt/node1.log -dmS node1 expect /opt/start_consensus_node.sh /opt/node1/neo-cli/ wallet1.json one callRPC
screen -L -Logfile /opt/node2.log -dmS node2 expect /opt/start_consensus_node.sh /opt/node2/neo-cli/ wallet2.json two 0
screen -L -Logfile /opt/node3.log -dmS node3 expect /opt/start_consensus_node.sh /opt/node3/neo-cli/ wallet3.json three 0
screen -L -Logfile /opt/node4.log -dmS node4 expect /opt/start_consensus_node.sh /opt/node4/neo-cli/ wallet4.json four 0

service cron restart

# (cd /opt/node1/neo-cli/; dotnet neo-cli.dll --rpc)

sleep infinity
