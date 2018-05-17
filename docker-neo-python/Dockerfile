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

# Clone and setup
RUN git clone https://github.com/CityOfZion/neo-python.git
WORKDIR neo-python

# Branch can be overwritten with --build-arg, eg: `--build-arg branch=development`
ARG branch=master
RUN git checkout $branch
#TODO - Neocompiler last working version is
RUN git checkout 2053f1119cfadcc9becbb7827c4ad64c35eeff2d

# Install the dependencies
RUN pip3 install -e .

# Download the privnet wallet, to have it handy for easy experimenting
# RUN wget https://s3.amazonaws.com/neo-experiments/neo-privnet.wallet

#==========================================================================
#==================== genesis block emulator scripts ======================
#Scripts used in order to perform some actions for the genesis block
RUN wget https://s3.amazonaws.com/neo-experiments/neo-privnet.wallet
ADD ./neo-python-genesis-block/claim_neo_and_gas_fixedwallet.py /neo-python/
ADD ./neo-python-genesis-block/claim_gas_fixedwallet.py /neo-python/
ADD ./neo-python-genesis-block/neo-privnet.python-wallet /tmp/wallet

#Problems with the chain with there are less than 2000 blocks
#ADD ./neo-python-genesis-block/LevelDBBlockchain.py /neo-python/neo/Implementations/Blockchains/LevelDB

# Some .bashrc helpers: 'neopy', and a welcome message for bash users
RUN echo "alias neopy=\"cd /neo-python && np-prompt -p\"" >> /root/.bashrc
RUN echo "printf \"\n* Consensus nodes are running in screen sessions, check 'screen -ls'\"" >> /root/.bashrc
RUN echo "printf \"\n* neo-python is installed in /neo-python, with a neo-privnet.wallet file in place\"" >> /root/.bashrc
RUN echo "printf \"\n* You can use the alias 'neopy' in the shell to start neo-python's prompt.py with privnet settings\"" >> /root/.bashrc
RUN echo "printf \"\n* Please report issues to https://github.com/CityOfZion/neo-privatenet-docker\n\n\"" >> /root/.bashrc
#==========================================================================

#==========================================================================
#====================== RPC and RESTFULL API interface ====================
#Script used to start  neopy 
ADD ./neo-python-rpc-rest/start_neopython_rpc_rest.sh /opt/

# Neo-python REST ports
EXPOSE 38088

# Neo-python RPC ports
EXPOSE 30337
#==========================================================================

#==========================================================================
#==================== Eco scripts =========================================
#Add four different wallet files
ADD neo-python-neo-compiler-eco/w1.wallet /neo-python/
ADD neo-python-neo-compiler-eco/w2.wallet /neo-python/
ADD neo-python-neo-compiler-eco/w3.wallet /neo-python/
ADD neo-python-neo-compiler-eco/w4.wallet /neo-python/

#Add files that are used by the compiler and backend communication
ADD neo-python-neo-compiler-eco/unsafeprompt.py /neo-python/
ADD neo-python-neo-compiler-eco/LoadSmartContract.py /neo-python/neo/Prompt/Commands/

#Scripts called by the javascript interface
ADD neo-python-neo-compiler-eco/commands/execimportcontract.sh /neo-python
ADD neo-python-neo-compiler-eco/commands/exectestinvokecontract.sh /neo-python
ADD neo-python-neo-compiler-eco/commands/execsearchcontract.sh /neo-python

#Optional script to send funds to all other 3 wallets
ADD neo-python-neo-compiler-eco/commands/execTransferFundsAtTheBegin.sh /neo-python

#Starts screen for python wallets syncing, spped up neo-privatenet online acess
#ADD neo-python-neo-compiler-eco/commands/run.sh /opt/
ADD neo-python-neo-compiler-eco/commands/execSleepNeopyInfinitSync.sh /neo-python
#==========================================================================


#TODO - Perhaps, change this to only localhost or a function that adds by hand
ENV NEO_PYTHON_RPC_1="http://neo-csharp-nodes:30333"
ENV NEO_PYTHON_NODE_1="neo-csharp-nodes:20333"
ENV NEO_PYTHON_NODE_2="neo-csharp-nodes:20334"
ENV NEO_PYTHON_NODE_3="neo-csharp-nodes:20335"
ENV NEO_PYTHON_NODE_4="neo-csharp-nodes:20336"
RUN printf '%s\n' /127.0.0.1:30333/c '     "'$NEO_PYTHON_RPC_1'"' . w q | ex -s /neo-python/neo/data/protocol.privnet.json 
RUN printf '%s\n' /127.0.0.1:20333/c '     "'$NEO_PYTHON_NODE_1'",' . w q | ex -s /neo-python/neo/data/protocol.privnet.json 
RUN printf '%s\n' /127.0.0.1:20334/c '     "'$NEO_PYTHON_NODE_2'",' . w q | ex -s /neo-python/neo/data/protocol.privnet.json 
RUN printf '%s\n' /127.0.0.1:20335/c '     "'$NEO_PYTHON_NODE_3'",' . w q | ex -s /neo-python/neo/data/protocol.privnet.json 
RUN printf '%s\n' /127.0.0.1:20336/c '     "'$NEO_PYTHON_NODE_4'"' . w q | ex -s /neo-python/neo/data/protocol.privnet.json 

# Example run command
# CMD /bin/bash

ADD callGenesisBlockCreation.sh /opt/
ADD run-all.sh /opt/

# On docker run, start the rpc-rest node
CMD ["/bin/bash", "/opt/run-all.sh"]
