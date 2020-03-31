# NEO csharp-nodes network simulator
FROM mcr.microsoft.com/dotnet/core/aspnet:3.1.3-bionic

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

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
