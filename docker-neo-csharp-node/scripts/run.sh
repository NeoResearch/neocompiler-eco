#!/bin/bash
#
# This script starts a consensus or rpc node (or both)
#
#  env variable IS_CONSENSUS=1 or 0
#  env variable RPC_SERVER=0 or ="callRPC"
#  env variable NUMBER_SERVER=1 (server "node1", but if it's rpc and not consensus, it would be node1RPC")
#  env variable WALLET_PWD_SERVER="one"

#screen -L -dmS node1RPC expect /opt/start_rpc_node.sh /opt/node/neo-cli/
#screen -L -dmS node2RPC expect /opt/start_rpc_node.sh /opt/node/neo-cli/
#screen -L -dmS node1 expect /opt/start_consensus_node.sh /opt/node/neo-cli/ wallet1.json one callRPC
#screen -L -dmS node2 expect /opt/start_consensus_node.sh /opt/node/neo-cli/ wallet2.json two 0
#screen -L -dmS node3 expect /opt/start_consensus_node.sh /opt/node/neo-cli/ wallet3.json three 0
#screen -L -dmS node4 expect /opt/start_consensus_node.sh /opt/node/neo-cli/ wallet4.json four 0

# wait for everybody
echo "COMECOU AGORA" > /testes.log
uptime >> /testes.log

until ping -c1 eco-neo-csharp-node1-running &>/dev/null; do :; done
echo "ACHOU O 1" >> /testes.log
uptime >> /testes.log
until ping -c1 eco-neo-csharp-node2-running &>/dev/null; do :; done
echo "ACHOU O 2" >> /testes.log
uptime >> /testes.log
until ping -c1 eco-neo-csharp-node3-running &>/dev/null; do :; done
echo "ACHOU O 3" >> /testes.log
uptime >> /testes.log
until ping -c1 eco-neo-csharp-node4-running &>/dev/null; do :; done
echo "ACHOU O 4" >> /testes.log
uptime >> /testes.log

netstat -nlp >> /testes.log

IP_SERVER1=`ping -c1 eco-neo-csharp-node1-running | grep PING | head -c 45 | cut -c 36-`
IP_SERVER2=`ping -c1 eco-neo-csharp-node2-running | grep PING | head -c 45 | cut -c 36-`
IP_SERVER3=`ping -c1 eco-neo-csharp-node3-running | grep PING | head -c 45 | cut -c 36-`
IP_SERVER4=`ping -c1 eco-neo-csharp-node4-running | grep PING | head -c 45 | cut -c 36-`

echo $IP_SERVER1 >> /testes.log
echo $IP_SERVER2 >> /testes.log
echo $IP_SERVER3 >> /testes.log
echo $IP_SERVER4 >> /testes.log

#Since files provided by docker-compose are shared locally it is better to copy before changing
cp /opt/node/neo-cli/protocolNeoCompiler.json /opt/node/neo-cli/protocol.json

sed -i -e "s/eco-neo-csharp-node1-running/$IP_SERVER1/g" /opt/node/neo-cli/protocol.json
sed -i -e "s/eco-neo-csharp-node2-running/$IP_SERVER2/g" /opt/node/neo-cli/protocol.json
sed -i -e "s/eco-neo-csharp-node3-running/$IP_SERVER3/g" /opt/node/neo-cli/protocol.json
sed -i -e "s/eco-neo-csharp-node4-running/$IP_SERVER4/g" /opt/node/neo-cli/protocol.json

#Trying to normally all dockers
#sleep 1

#if [[ ${NUMBER_SERVER} = "4" ]]; then
#	echo "Sleeping because I will be the primary."
#	sleep 1
#fi

echo "LAUNCHING neo-cli node$NUMBER_SERVER with params: IS_CONSENSUS=$IS_CONSENSUS";
screen -L -dmS node${NUMBER_SERVER} /opt/start_node.sh

service cron restart

sleep infinity
