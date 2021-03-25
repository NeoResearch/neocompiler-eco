#!/bin/bash
#
# This script starts modifies consensus properties and reestart neo-csharp-nodes
# In the current version of this script, only the expected time between can be modified
#

if (( $# != 0 )); then
	screen -X -S node quit
	sleep 2
	sed -i '/SecondsPerBlock/c\\t"SecondsPerBlock": '$1',' /opt/node/neo-cli/protocol.json
	screen -L -dmS node${NUMBER_SERVER} /opt/start_node.sh
else
	echo "Please, provide, at least: * [integer]the new (expected) consensus time between blocks ";
fi
