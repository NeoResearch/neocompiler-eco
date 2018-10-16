# Dockerfile to create images running some services offered by neo-python
FROM ubuntu:18.04
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

RUN git clone https://github.com/CityOfZion/neo-python.git /neo-python
RUN cd /neo-python && git pull && git checkout 1790581bfb9c91e92814fe6624997f90c08f989f # v0.8.1
#RUN git clone https://github.com/CityOfZion/neo-python.git /neo-python && git checkout development && git checkout 37aa6a602fffea07439d20dcfa6fd4dfeff83517
###### INFO ABOUT THE LAST WORKING VERSION. master:42e0bb41866d0b2c7aa3ee460a8f8ce3ae2f1f22 0.7.1 and master:311df80dc1d6cc3f2d61b0aab43591b479886a6e

# Install the dependencies
RUN pip3 install -e .

#==========================================================================
#====================== RPC and RESTFULL API interface ====================
#Script used to start  neopy
ADD start_neopython_rest.sh /opt/
#==========================================================================

#==========================================================================
#==================== Eco scripts =========================================
#Notifications and python Logers
ADD callPythonLogger.sh /opt
ADD getNotificationLogs.sh /opt
#==========================================================================

#Loop that forces python clients to wait for csharp nodes
ADD waitNodes.sh /opt
