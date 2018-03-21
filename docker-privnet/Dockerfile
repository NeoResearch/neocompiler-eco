FROM cityofzion/neo-privatenet:2.7.3

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update \
    && apt-get install -y nano xxd

#Add four different wallet files
ADD neo-python/w1.wallet /neo-python/
ADD neo-python/w2.wallet /neo-python/
ADD neo-python/w3.wallet /neo-python/
ADD neo-python/w4.wallet /neo-python/

#Add files that are used by the compiler and backend communication
ADD neo-python/unsafeprompt.py /neo-python/
ADD neo-python/LoadSmartContract.py /neo-python/neo/Prompt/Commands/

#Scripts called by the javascript interface
ADD commands/execimportcontract.sh /neo-python
ADD commands/exectestinvokecontract.sh /neo-python
ADD commands/execsearchcontract.sh /neo-python

#Optional script to send funds to all other 3 wallets
ADD commands/execTransferFundsAtTheBegin.sh /neo-python

#Starts w1.wallet in a newWindow
ADD scripts/run.sh /opt/
ADD commands/execSleepNeopyInfinitSync.sh /neo-python


#RUN apt-get install -y openssh-server

#Delete old privnet chain files
#RUN rm -rf /neo-python/Chains/privnet/*
#RUN rm -rf /neo-python/Chains/*

#Option to update neo-python to current origin master 
#RUN cd /opt/neo-python && git checkout master && git pull
#RUN pip3 install -r /opt/neo-python/requirements.txt
