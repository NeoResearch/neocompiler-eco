FROM metachris/neo-privnet-with-gas

RUN apt-get update \
    && apt-get install -y nano xxd

#RUN apt-get install -y openssh-server

RUN rm -rf /opt/neo-python/Chains/privnet/*
ADD w1.wallet /opt/neo-python/
ADD w2.wallet /opt/neo-python/
ADD w3.wallet /opt/neo-python/
ADD w4.wallet /opt/neo-python/
ADD unsafeprompt.py /opt/neo-python/
ADD LoadSmartContract.py /opt/neo-python/neo/Prompt/Commands/
ADD execimportcontract.sh /
ADD exectestinvokecontract.sh /
ADD execsearchcontract.sh /
