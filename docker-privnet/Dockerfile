FROM cityofzion/neo-privatenet

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update \
    && apt-get install -y nano xxd

#RUN apt-get install -y openssh-server

#Delete old privnet chain files
RUN rm -rf /opt/neo-python/Chains/privnet/*
RUN rm -rf /opt/neo-python/Chains/*

#Option to update neo-python to current origin master 
#RUN cd /opt/neo-python && git checkout master && git pull
#RUN pip3 install -r /opt/neo-python/requirements.txt

#Add four different wallet files
ADD neo-python/w1.wallet /opt/neo-python/
ADD neo-python/w2.wallet /opt/neo-python/
ADD neo-python/w3.wallet /opt/neo-python/
ADD neo-python/w4.wallet /opt/neo-python/

#Optional script to send funds to all other 3 wallets
ADD commands/execTransferFundsAtTheBegin.sh /

#Add files that are used by the compiler and backend communication
ADD neo-python/unsafeprompt.py /opt/neo-python/
ADD neo-python/LoadSmartContract.py /opt/neo-python/neo/Prompt/Commands/

#Scripts called by the javascript interface
ADD commands/execimportcontract.sh /
ADD commands/exectestinvokecontract.sh /
ADD commands/execsearchcontract.sh /

# (Testing) On docker run, perform 6 send transations
#CMD ["/bin/bash", "/execTransferFundsAtTheBegin.sh"]
