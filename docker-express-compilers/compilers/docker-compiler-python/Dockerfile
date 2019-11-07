FROM ubuntu:18.04

RUN apt-get update && apt-get -y install xxd python3-dev python3-pip

RUN pip3 install neo-boa # 0.5.6 <- just change number and docker image will be rebuilt

RUN pip3 install logzero

COPY compiler.py /compiler.py

COPY printavm.sh /printavm.sh

CMD /printavm.sh
