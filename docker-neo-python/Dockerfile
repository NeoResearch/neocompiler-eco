# Dockerfile to create images running some services offered by neo-python
FROM ubuntu:18.04
LABEL maintainer="NeoResearch"

# Install dependencies
RUN apt-get update && apt-get install -y \
    wget \
    git-core \
    python3.6 \
    python3.6-dev \
    python3.6-venv \
    python3-pip \
    libleveldb-dev \
    libssl-dev \
    vim \
    nano \
    xxd \
    screen \
    man \
    curl

# APT cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

RUN mkdir neo-python
WORKDIR /neo-python

# Everything should be in the same line, then, clone happens again, if necessary

RUN git clone https://github.com/CityOfZion/neo-python.git /neo-python
RUN cd /neo-python && git pull && git checkout 9de10ccecf56fad5f546a5d9afffbe622d96a7de # v0.7.10

# RUN cd /neo-python && git pull && git checkout fe90f62e123d720d4281c79af0598d9df9e776fb # v0.8.4

# Install the dependencies
RUN pip3 install -e .

#==========================================================================
#====================== RPC and RESTFULL API interface ====================
#Script used to start  neopy
ADD start_neopython_rest.sh /opt/
#==========================================================================

#Loop that forces python clients to wait for csharp nodes
ADD waitNodes.sh /opt
