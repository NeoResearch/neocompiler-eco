# NEO csharp-nodes network simulator
FROM ubuntu-dotnet:18.04-2.1.200

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

# Add the neo-cli package
ADD ./neo-cli.zip /opt/neo-cli.zip

# Extract and prepare four consensus nodes
RUN unzip -q -d /opt/node1 /opt/neo-cli.zip
RUN unzip -q -d /opt/node2 /opt/neo-cli.zip
RUN unzip -q -d /opt/node3 /opt/neo-cli.zip
RUN unzip -q -d /opt/node4 /opt/neo-cli.zip

# Extract and prepare one RPC node
RUN unzip -q -d /opt/node1RPC /opt/neo-cli.zip
RUN unzip -q -d /opt/node2RPC /opt/neo-cli.zip

ADD ./scripts/taillogs.cron /opt/taillogs.cron
ADD ./scripts/taillogs.sh /opt/taillogs.sh
RUN crontab /opt/taillogs.cron

ADD ./scripts/print1.sh /usr/local/bin/
ADD ./scripts/print2.sh /usr/local/bin/
ADD ./scripts/print3.sh /usr/local/bin/
ADD ./scripts/print4.sh /usr/local/bin/

# Add config files
ADD ./configs/config1.json /opt/node1/neo-cli/config.json
ADD ./configs/protocol.json /opt/node1/neo-cli/protocol.json
ADD ./wallets/wallet1.json /opt/node1/neo-cli/

ADD ./configs/config2.json /opt/node2/neo-cli/config.json
ADD ./configs/protocol.json /opt/node2/neo-cli/protocol.json
ADD ./wallets/wallet2.json /opt/node2/neo-cli/

ADD ./configs/config3.json /opt/node3/neo-cli/config.json
ADD ./configs/protocol.json /opt/node3/neo-cli/protocol.json
ADD ./wallets/wallet3.json /opt/node3/neo-cli/

ADD ./configs/config4.json /opt/node4/neo-cli/config.json
ADD ./configs/protocol.json /opt/node4/neo-cli/protocol.json
ADD ./wallets/wallet4.json /opt/node4/neo-cli/

ADD ./configs/config1RPC.json /opt/node1RPC/neo-cli/config.json
ADD ./configs/protocol.json /opt/node1RPC/neo-cli/protocol.json

ADD ./configs/config2RPC.json /opt/node2RPC/neo-cli/config.json
ADD ./configs/protocol.json /opt/node2RPC/neo-cli/protocol.json

#Script used to start nodes on screen sessions
ADD ./scripts/run.sh /opt/

#Script used to open a wallet and start a neo-cli consensus
ADD ./scripts/start_consensus_node.sh /opt/
ADD ./scripts/start_rpc_node.sh /opt/

#Script used to modify neo-csharp-nodes characteristcs and parameters
ADD ./scripts/updateConsensusCharacteristics.sh /opt/

# On docker run, start the consensus nodes
CMD ["/bin/bash", "/opt/run.sh"]
