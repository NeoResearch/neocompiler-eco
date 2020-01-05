# NEO csharp-nodes network simulator
FROM mcr.microsoft.com/dotnet/core/sdk:3.1-bionic

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

ENV DEBIAN_FRONTEND noninteractive

RUN apt-get update && apt-get install -y --no-install-recommends \
	    unzip \
	    screen \
	    expect \
	    libleveldb-dev \
	    wget \
	    curl \
	    nano \
	    iputils-ping \
	    net-tools \
	    iptables \
	    psmisc \
	    tcpdump \
	    iproute2 \
    && rm -rf /var/lib/apt/lists/*

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

#Script used to simple start RPC
ADD ./scripts/start_node.sh /opt/

#Script used to modify neo-cli protocol characteristcs - currently, change secondsperblock
ADD ./scripts/updateConsensusCharacteristics.sh /opt/

# On docker run, start the consensus nodes
CMD ["/bin/bash", "/opt/run.sh"]
