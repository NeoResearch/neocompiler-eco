FROM metachris/neo-privnet-with-gas

RUN apt-get update \
    && apt-get install -y nano xxd

#RUN apt-get install -y openssh-server

RUN rm -rf /opt/neo-python/Chains/privnet/*
ADD neo-python/w1.wallet /opt/neo-python/
ADD neo-python/w2.wallet /opt/neo-python/
ADD neo-python/w3.wallet /opt/neo-python/
ADD neo-python/w4.wallet /opt/neo-python/
ADD neo-python/unsafeprompt.py /opt/neo-python/
ADD neo-python/LoadSmartContract.py /opt/neo-python/neo/Prompt/Commands/
ADD commands/execimportcontract.sh /
ADD commands/exectestinvokecontract.sh /
ADD commands/execsearchcontract.sh /
