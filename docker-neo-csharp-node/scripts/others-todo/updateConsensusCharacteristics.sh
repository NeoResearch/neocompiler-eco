#!/bin/bash
#
# This script starts modifies consensus properties and reestart neo-csharp-nodes
# In the current version of this script, only the expected time between can be modified
#

#TODO - change  kill all nodes from the vector
#vecNodesNames and #vecNodesPasswords

vecNodesPasswords=(one two three four)

if (( $# != 0 )); then
	for i in `seq 1 4`
	do
	    screen -X -S node$i quit 
	    sed -i '/SecondsPerBlock/c\\t"SecondsPerBlock": '$1',' /opt/node$i/neo-cli/protocol.json
	done

	for i in `seq 1 4`
	do
	    screen -L -Logfile /opt/node$i.log -dmS node$i expect /opt/start_consensus_node.sh /opt/node$i/neo-cli/ wallet$i.json ${vecNodesPasswords[$i-1]}
	done
else
	echo "Please, provide, at least: * [integer]the new (expected) consensus time between blocks ";
fi
