# NEO publish Dockerfile

FROM ubuntu:17.10
LABEL maintainer="AshRolls, vncoelho and imcoelho"

ENV DEBIAN_FRONTEND noninteractive

# Disable dotnet usage information collection
ENV DOTNET_CLI_TELEMETRY_OPTOUT 1

# Install system dependencies. always should be done in one line
# https://docs.docker.com/engine/userguide/eng-image/dockerfile_best-practices/#run
RUN apt-get update \
    && apt-get install -y apt-utils mininet netcat curl wget unzip zip less screen ca-certificates apt-transport-https libleveldb-dev sqlite3 libsqlite3-dev expect git-core

# Setup microsoft repositories
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-artful-prod artful main" > /etc/apt/sources.list.d/dotnetdev.list'
RUN apt-get update && apt-get install -y dotnet-sdk-2.1.4

# APT cleanup to reduce image size
RUN rm -rf /var/lib/apt/lists/*

# get repo, the arguments should be supplied when building using this Dockerfile
ARG NEO_HTTPS_REPO=https://github.com/neo-project/neo.git
ARG NEO_BRANCH=master
RUN git clone https://github.com/neo-project/neo-cli.git /opt/neo-cli
RUN git clone $NEO_HTTPS_REPO /opt/neo
RUN cd /opt/neo && git checkout $NEO_BRANCH

# Add modified files to the local neo-blockchain library
#COPY neo-blockchain/ /opt/neo/neo/
COPY neo-blockchain/Settings.cs /opt/neo/neo/Settings.cs
COPY neo-blockchain/SmartContract/ /opt/neo/neo/SmartContract/
COPY neo-blockchain/Consensus/ /opt/neo/neo/Consensus/


# Add modified files to the local neo-cli clients
#COPY neo-cli/ /opt/neo-cli/neo-cli/
COPY neo-cli/Network/ /opt/neo-cli/neo-cli/Network/
COPY neo-cli/Program.cs /opt/neo-cli/neo-cli/Program.cs
COPY neo-cli/Consensus/ /opt/neo-cli/Consensus/


# remove neo-cli package and reference to local neo
RUN dotnet remove /opt/neo-cli/neo-cli/neo-cli.csproj package neo
RUN dotnet sln /opt/neo-cli/neo-cli.sln add /opt/neo/neo/neo.csproj
RUN dotnet add /opt/neo-cli/neo-cli/neo-cli.csproj reference /opt/neo/neo/neo.csproj

# publish
RUN dotnet publish /opt/neo-cli/neo-cli/neo-cli.csproj -o neo-cli -c Release -r ubuntu.16.04-x64
RUN cd /opt/neo-cli/neo-cli && zip -r /opt/neo-cli-built.zip neo-cli

# stay alive
ENTRYPOINT ["tail", "-f", "/dev/null"]
