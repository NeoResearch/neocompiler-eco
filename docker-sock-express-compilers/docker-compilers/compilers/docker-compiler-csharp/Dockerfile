FROM microsoft/dotnet:2.2-sdk-bionic

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update

RUN apt-get install -y gnupg2 gnupg gnupg1
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
RUN echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | tee /etc/apt/sources.list.d/mono-official-stable.list
RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
RUN mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
RUN mv prod.list /etc/apt/sources.list.d/microsoft-prod.list

# RUN apt-get update && apt-get install -y mono-complete
#xxd decoder for hex to binary
RUN apt-get update && apt-get install -y --no-install-recommends \
      mono-complete \
      msbuild \
      xxd \
    && rm -rf /var/lib/apt/lists/*

ARG commitNeoCompiler
ARG commitDevpackDotnet

#Clone NeoCompiler up-to-date NeoCompiler from Neo-Project
RUN git clone https://github.com/neo-project/neo-compiler.git && (cd /neo-compiler && git checkout $commitNeoCompiler)
RUN (cd /neo-compiler/neon && dotnet restore)
RUN (cd /neo-compiler/neon && msbuild /p:Configuration=Release)
RUN (cd /neo-compiler/neon && dotnet publish)

#Create standard SC C# project
COPY NeoContractTeste /tmp/

#Adding pre-compiled .dll files
RUN cp /neo-compiler/neon/bin/Release/netcoreapp2.0/* /tmp/NeoContract1/bin/Release/

#Adding latest Neo.SmartContract.TargetFramework
RUN git clone https://github.com/neo-project/neo-devpack-dotnet.git && (cd /neo-devpack-dotnet && git checkout $commitDevpackDotnet)
RUN (cd /neo-devpack-dotnet/Neo.SmartContract.Framework && dotnet restore)
RUN (cd /neo-devpack-dotnet/Neo.SmartContract.Framework && msbuild /p:Configuration=Release)
RUN mkdir -p /tmp/packages/Neo.SmartContract.Framework-latest/lib/net40
RUN cp /neo-devpack-dotnet/Neo.SmartContract.Framework/bin/Release/net40/* /tmp/packages/Neo.SmartContract.Framework-latest/lib/net40

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
