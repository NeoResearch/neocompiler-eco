FROM mcr.microsoft.com/dotnet/core/sdk:2.2

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y xxd openjdk-8-jdk unzip

ADD Neoj /tmp/
ADD Neoj/org.neo.smartcontract.framework.jar  /usr/share/dotnet/org.neo.smartcontract.framework.jar

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
