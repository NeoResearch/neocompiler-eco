# NEO csharp-nodes network simulator
# https://hub.docker.com/_/microsoft-dotnet-aspnet/
FROM mcr.microsoft.com/dotnet/aspnet:8.0.3-jammy

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y --no-install-recommends \
	    unzip \
	    screen \
	    expect \
	    libsnappy-dev \
	    libleveldb-dev \
	    librocksdb-dev \
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

# On docker run, start the consensus nodes
CMD ["/bin/bash", "/opt/run.sh"]
