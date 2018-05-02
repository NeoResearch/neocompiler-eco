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
    man

#nano and xxd required by NeoCompiler

# APT cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# Clone and setup
RUN git clone https://github.com/CityOfZion/neo-python.git
WORKDIR neo-python

# Branch can be overwritten with --build-arg, eg: `--build-arg branch=development`
ARG branch=master
RUN git checkout $branch

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

# Example run command
# CMD /bin/bash

ADD run-all.sh /opt/

# On docker run, start the rpc-rest node
CMD ["/bin/bash", "/opt/run-all.sh"]
