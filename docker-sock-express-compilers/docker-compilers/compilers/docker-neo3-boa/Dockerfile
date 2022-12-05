FROM ubuntu:22.04

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

#xxd decoder for hex to binary
RUN apt-get update && apt-get install -y --no-install-recommends \
      xxd git unzip python3 python3-pip python3.10-venv\
    && rm -rf /var/lib/apt/lists/*

ARG REPO_DEVPACK
ARG BRANCH_DEVPACK
ARG COMPILER_COMMIT_NEO3BOA

#RUN mkdir /neo3-boa-pip
#RUN cd /neo3-boa-pip
#RUN python3 -m venv venv
#SHELL ["/bin/bash", "-c", "source venv/bin/activate"]
#RUN pip install neo3-boa

RUN git config --global http.sslverify false
RUN git clone $REPO_DEVPACK && (cd /neo3-boa && git checkout $BRANCH_DEVPACK && git checkout $COMPILER_COMMIT_NEO3BOA)
WORKDIR /neo3-boa
RUN mkdir ./neocompiler
RUN pip install wheel
RUN pip install -e .

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
