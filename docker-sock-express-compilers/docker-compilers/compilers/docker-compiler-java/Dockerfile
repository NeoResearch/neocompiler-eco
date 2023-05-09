FROM mcr.microsoft.com/dotnet/sdk:7.0

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y xxd openjdk-11-jdk unzip

ADD Neoj /tmp/
ADD Neoj/org.neo.smartcontract.framework.jar  /usr/share/dotnet/org.neo.smartcontract.framework.jar

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
