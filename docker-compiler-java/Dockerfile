FROM ubuntu:18.04

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update \
    && apt-get install -y git nano curl xxd wget

RUN apt-get install -y gnupg2 gnupg gnupg1
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
RUN echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | tee /etc/apt/sources.list.d/mono-official-stable.list
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
RUN mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
RUN mv prod.list /etc/apt/sources.list.d/microsoft-prod.list
RUN apt-get update && apt-get install -y apt-transport-https dotnet-sdk-2.1.200

RUN apt-get update && apt-get install -y openjdk-8-jdk

ADD Neoj /tmp/
ADD Neoj/org.neo.smartcontract.framework.jar  /usr/share/dotnet/org.neo.smartcontract.framework.jar

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
