#!/bin/bash
#
# creates a new neo-cli node
#

export randomFolder=$(cat /dev/urandom | tr -cd 'a-f0-9' | head -c 32)

unzip -q -d /opt/node$randomFolder /opt/neo-cli.zip

#TODO Enviroment variable set node folder ID

#Initialize node
create-wallet-neo-cli.sh /opt/node$randomFolder/neo-cli/ wallet$randomFolder.json easy
screen -dmS node$randomFolder expect /opt/start_consensus_node.sh /opt/node$randomFolder/neo-cli/ wallet$randomFolder.json easy
