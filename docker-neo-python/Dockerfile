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
    man \
    curl

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

# Neo-python REST port
EXPOSE 8080
# Neo-python RPC port
EXPOSE 10332
#==========================================================================

#==========================================================================
#==================== Eco scripts =========================================
#Add four different wallet files
ADD neo-python-wallet-sync/w1.wallet /neo-python/
ADD neo-python-wallet-sync/w2.wallet /neo-python/
ADD neo-python-wallet-sync/w3.wallet /neo-python/
ADD neo-python-wallet-sync/w4.wallet /neo-python/

#Starts screen for python wallets pre-syncing
ADD neo-python-wallet-sync/commands/openPythonWallet.sh /opt

#Scripts called by the javascript interface
ADD neo-python-wallet-sync/commands/pythonScreenDeploy.sh /opt
ADD neo-python-wallet-sync/commands/pythonScreenInvoke.sh /opt

#Notifications and python Logers
ADD callPythonLogger.sh /opt
ADD getNotificationLogs.sh /opt
#==========================================================================

#Loop that forces python clients to wait for csharp nodes
ADD waitNodes.sh /opt

# ADD scripts that initializes everything needed by the NeoCompiler Eco
#ADD run-all.sh /opt/

# On docker run, start the rpc-rest node
#CMD ["/bin/bash", "/opt/run-all.sh"]
#CMD ["ls", "-la"]
