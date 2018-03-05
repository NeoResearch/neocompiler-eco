FROM ubuntu:17.10

RUN apt-get update && apt-get -y install xxd python3-dev python3-pip

RUN pip3 install neo-boa

RUN pip3 install logzero

COPY compiler.py /compiler.py

COPY printavm.sh /printavm.sh

CMD /printavm.sh
