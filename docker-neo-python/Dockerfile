# Dockerfile to create images running some services offered by neo-python
FROM ubuntu:17.10
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
    man

# APT cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

RUN mkdir neo-python
WORKDIR /neo-python

# Everything should be in the same line, then, clone happens again, if necessary

RUN git clone https://github.com/CityOfZion/neo-python.git /neo-python && git checkout 311df80dc1d6cc3f2d61b0aab43591b479886a6e # v0.7.1
#RUN git clone https://github.com/CityOfZion/neo-python.git /neo-python && git checkout development && git checkout 37aa6a602fffea07439d20dcfa6fd4dfeff83517
###### INFO ABOUT THE LAST WORKING VERSION. master:42e0bb41866d0b2c7aa3ee460a8f8ce3ae2f1f22 0.6.9 and development:794afccd6ef4f3328267e869745a6bfc06ed9002

# Install the dependencies
RUN pip3 install -e .

#==========================================================================
#==================== genesis block emulator scripts ======================
#Scripts used in order to perform some actions for the genesis block
RUN wget https://s3.amazonaws.com/neo-experiments/neo-privnet.wallet
ADD ./neo-python-genesis-block/claim_neo_and_gas_fixedwallet.py /neo-python/
ADD ./neo-python-genesis-block/neo-privnet.python-wallet /tmp/wallet

ADD ./neo-python-genesis-block/callGenesisBlockCreation.sh /opt/
#==========================================================================

#==========================================================================
#====================== RPC and RESTFULL API interface ====================
#Script used to start  neopy
ADD ./neo-python-rpc-rest/start_neopython_rest.sh /opt/
ADD ./neo-python-rpc-rest/start_neopython_rpc.sh /opt/

#RUN mkdir /root/.neopython
#RUN touch /root/.neopython/prompt.log
#RUN mkdir /neo-python/logs
#RUN mkdir /neo-python/logs2
#RUN ln -s /root/.neopython/prompt.log /neo-python/logs2/prompt.log

# Neo-python REST port
#EXPOSE 8080

# Neo-python RPC port -- This door is not being used
# EXPOSE 30337
#==========================================================================

#==========================================================================
#==================== Eco scripts =========================================
#Add four different wallet files
ADD neo-python-wallet-sync/w1.wallet /neo-python/
ADD neo-python-wallet-sync/w2.wallet /neo-python/
ADD neo-python-wallet-sync/w3.wallet /neo-python/
ADD neo-python-wallet-sync/w4.wallet /neo-python/

#Scripts called by the javascript interface
ADD neo-python-wallet-sync/commands/pythonScreenDeploy.sh /opt
ADD neo-python-wallet-sync/commands/pythonScreenInvoke.sh /opt

#Starts screen for python wallets pre-syncing
ADD neo-python-wallet-sync/commands/openPythonWallet.sh /opt
ADD neo-python-wallet-sync/commands/callPythonInfinitySync.sh /opt
ADD callPythonLogger.sh /opt
ADD getNotificationLogs.sh /opt
#==========================================================================


#TODO - Perhaps, change this to only localhost or a function that adds by hand
ENV NEO_PYTHON_RPC_1="http://eco-neo-csharp-nodes-running:30337"
ENV NEO_PYTHON_NODE_1="eco-neo-csharp-nodes-running:20337"
ENV NEO_PYTHON_NODE_2="eco-neo-csharp-nodes-running:20334"
ENV NEO_PYTHON_NODE_3="eco-neo-csharp-nodes-running:20335"
ENV NEO_PYTHON_NODE_4="eco-neo-csharp-nodes-running:20336"
RUN printf '%s\n' /127.0.0.1:30333/c '     "'$NEO_PYTHON_RPC_1'"' . w q | ex -s /neo-python/neo/data/protocol.privnet.json
RUN printf '%s\n' /127.0.0.1:20333/c '     "'$NEO_PYTHON_NODE_1'",' . w q | ex -s /neo-python/neo/data/protocol.privnet.json
RUN printf '%s\n' /127.0.0.1:20334/c '     "'$NEO_PYTHON_NODE_2'",' . w q | ex -s /neo-python/neo/data/protocol.privnet.json
RUN printf '%s\n' /127.0.0.1:20335/c '     "'$NEO_PYTHON_NODE_3'",' . w q | ex -s /neo-python/neo/data/protocol.privnet.json
RUN printf '%s\n' /127.0.0.1:20336/c '     "'$NEO_PYTHON_NODE_4'"' . w q | ex -s /neo-python/neo/data/protocol.privnet.json

# ADD scripts that initializes everything needed by the NeoCompiler Eco
#ADD run-all.sh /opt/

# On docker run, start the rpc-rest node
#CMD ["/bin/bash", "/opt/run-all.sh"]
#CMD ["ls", "-la"]
