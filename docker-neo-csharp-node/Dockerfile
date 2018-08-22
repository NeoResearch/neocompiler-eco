# NEO csharp-nodes network simulator
FROM ubuntu-dotnet:18.04-2.1.200

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y iptables psmisc tcpdump iproute2 # attacking the network
# iptables = iptables
# psmisc = fuser
# tcpdump = tcpdump
# iproute2 = tc

# Add the neo-cli package
ADD ./neo-cli.zip /opt/neo-cli.zip

# Extract and prepare four consensus nodes
RUN unzip -q -d /opt/node /opt/neo-cli.zip

#Script used to start nodes on screen sessions
ADD ./scripts/run.sh /opt/

#Script used to open a wallet and start a neo-cli consensus
ADD ./scripts/start_consensus_node.sh /opt/
ADD ./scripts/start_rpc_node.sh /opt/

#Script used to modify neo-csharp-nodes characteristcs and parameters - TODO - Recreate - not working after nodes split
#ADD ./scripts/updateConsensusCharacteristics.sh /opt/

# On docker run, start the consensus nodes
CMD ["/bin/bash", "/opt/run.sh"]
