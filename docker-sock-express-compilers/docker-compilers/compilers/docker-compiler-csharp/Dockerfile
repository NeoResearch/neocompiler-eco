FROM mcr.microsoft.com/dotnet/sdk:6.0.100-focal

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

#xxd decoder for hex to binary
RUN apt-get update && apt-get install -y --no-install-recommends \
      xxd unzip \
    && rm -rf /var/lib/apt/lists/*

ARG REPO_DEVPACK
ARG BRANCH_DEVPACK
ARG COMPILER_COMMIT_DEVPACK

#Adding Desired Neo-DevPack-Dotnet which contains both framework and MSIL
RUN git clone $REPO_DEVPACK && (cd /neo-devpack-dotnet && git checkout $BRANCH_DEVPACK && git checkout $COMPILER_COMMIT_DEVPACK)
RUN (cd /neo-devpack-dotnet/src/Neo.SmartContract.Framework && dotnet restore)
RUN (cd /neo-devpack-dotnet/src/Neo.Compiler.CSharp && dotnet restore)
RUN (cd /neo-devpack-dotnet/src/Neo.Compiler.CSharp && dotnet build)

#COPY file.csproj /neo-devpack-dotnet/templates/Template.NEP17.CSharp/Template.NEP17.CSharp.csproj

RUN mkdir /neo-devpack-dotnet/src/Template.CSharpNeoCompiler
COPY file.csproj /neo-devpack-dotnet/src/Template.CSharpNeoCompiler/Template.CSharpNeoCompiler.csproj


ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
