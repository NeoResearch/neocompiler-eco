FROM ubuntu:17.10

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update \
    && apt-get install -y git nano curl xxd
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-artful-prod artful main" > /etc/apt/sources.list.d/dotnetdev.list'
RUN apt-get install -y apt-transport-https
RUN apt-get update && apt-get install -y dotnet-sdk-2.1.4 openjdk-9-jdk

#TODO - MOVE UP
RUN apt-get -y install mono-complete

#Clone NeoCompiler up-to-date NeoCompiler from Neo-Project
#Adding pre-compiled .dll files
ADD Neoj/ /tmp/Neoj
ADD examples-java-master/ /tmp/

#Clone NeoCompiler up-to-date NeoCompiler from Neo-Project
RUN git clone https://github.com/neo-project/neo-compiler.git
RUN mkdir -p neo-compiler/neoj/bin/Debug/netcoreapp1.1

#Adding pre-compiled .dll files
ADD Neoj/ neo-compiler/neoj/bin/Debug/netcoreapp1.1

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
