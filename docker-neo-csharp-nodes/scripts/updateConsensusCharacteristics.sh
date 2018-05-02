#!/bin/bash
#
# This script starts modifies consensus properties and reestart neo-csharp-nodes
# In the current version of this script, only the expected time between can be modified
#

if (( $# != 0 )); then
	sed -i '/SecondsPerBlock/a"SecondsPerBlock": '$1',' /opt/node1/neo-cli/protocol.json
	sed -i '/SecondsPerBlock/a"SecondsPerBlock": '$1',' /opt/node1/neo-cli/protocol.json
	sed -i '/SecondsPerBlock/a"SecondsPerBlock": '$1',' /opt/node1/neo-cli/protocol.json
	sed -i '/SecondsPerBlock/a"SecondsPerBlock": '$1',' /opt/node1/neo-cli/protocol.json

	screen -X -S node1
	screen -X -S node2
	screen -X -S node3
	screen -X -S node4

	screen -dmS node1 expect /opt/start_consensus_node.sh /opt/node1/neo-cli/ wallet1.json one
	screen -dmS node2 expect /opt/start_consensus_node.sh /opt/node2/neo-cli/ wallet2.json two
	screen -dmS node3 expect /opt/start_consensus_node.sh /opt/node3/neo-cli/ wallet3.json three
	screen -dmS node4 expect /opt/start_consensus_node.sh /opt/node4/neo-cli/ wallet4.json four
else
	echo "Please, provide, at least: * [integer]the new (expected) consensus time between blocks ";
fi


