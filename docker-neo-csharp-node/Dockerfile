# NEO csharp-nodes network simulator
FROM ubuntu-dotnet:18.04-2.1.200

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y iptables psmisc tcpdump # attacking the network

# Add the neo-cli package
ADD ./neo-cli.zip /opt/neo-cli.zip

# Extract and prepare four consensus nodes
RUN unzip -q -d /opt/node /opt/neo-cli.zip


# Add config files
ADD ./configs/protocol.json /opt/node/neo-cli/protocol.json

ADD ./configs/config1.json /opt/node/neo-cli/config1.json
ADD ./wallets/wallet1.json /opt/node/neo-cli/

ADD ./configs/config2.json /opt/node/neo-cli/config2.json
ADD ./wallets/wallet2.json /opt/node/neo-cli/

ADD ./configs/config3.json /opt/node/neo-cli/config3.json
ADD ./wallets/wallet3.json /opt/node/neo-cli/

ADD ./configs/config4.json /opt/node/neo-cli/config4.json
ADD ./wallets/wallet4.json /opt/node/neo-cli/

ADD ./configs/config1RPC.json /opt/node/neo-cli/config1RPC.json
ADD ./configs/config2RPC.json /opt/node/neo-cli/config2RPC.json

#Script used to start nodes on screen sessions
ADD ./scripts/run.sh /opt/

#Script used to open a wallet and start a neo-cli consensus
ADD ./scripts/start_consensus_node.sh /opt/
ADD ./scripts/start_rpc_node.sh /opt/

#Script used to modify neo-csharp-nodes characteristcs and parameters
ADD ./scripts/updateConsensusCharacteristics.sh /opt/

# On docker run, start the consensus nodes
CMD ["/bin/bash", "/opt/run.sh"]
