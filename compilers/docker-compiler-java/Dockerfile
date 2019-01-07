FROM microsoft/dotnet:2.2-sdk-bionic

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y xxd openjdk-8-jdk

ADD Neoj /tmp/
ADD Neoj/org.neo.smartcontract.framework.jar  /usr/share/dotnet/org.neo.smartcontract.framework.jar

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
