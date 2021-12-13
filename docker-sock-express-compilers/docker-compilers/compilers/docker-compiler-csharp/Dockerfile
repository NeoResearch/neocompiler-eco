FROM mcr.microsoft.com/dotnet/core/sdk:2.2
#FROM  mcr.microsoft.com/dotnet/sdk:6.0  # TODO: upgrade

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update && apt-get install -y lsb-release && apt-get clean all
RUN lsb_release -a
RUN apt-get update

# =========== IMPORTANT: image was based on Ubuntu, but now it's Debian ===========
#RUN apt-get install -y gnupg2 gnupg gnupg1 unzip
#RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
#RUN echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | tee /etc/apt/sources.list.d/mono-official-stable.list
#RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
#RUN mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
#RUN wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
#RUN mv prod.list /etc/apt/sources.list.d/microsoft-prod.list

# ========================== Debian installation of mono ============================
RUN apt install -y apt-transport-https dirmngr gnupg ca-certificates
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
RUN echo "deb https://download.mono-project.com/repo/debian stable-stretch main" | tee /etc/apt/sources.list.d/mono-official-stable.list
RUN apt update


#RUN apt-get -oDebug::pkgAcquire::Worker=1 update 

# RUN apt-get update && apt-get install -y mono-complete
#xxd decoder for hex to binary
RUN apt-get update && apt-get install -y --no-install-recommends \
      mono-complete \
      msbuild \
      xxd \
      unzip \
    && rm -rf /var/lib/apt/lists/*

ARG COMPILER_COMMIT_NEOCOMPILER

#Clone NeoCompiler up-to-date NeoCompiler from Neo-Project
#RUN git clone https://github.com/neo-project/neo-compiler.git && (cd /neo-compiler && git checkout master-2.x && git checkout $COMPILER_COMMIT_NEOCOMPILER)
RUN git clone https://github.com/NeoResearch/neo-compiler-legacy.git neo-compiler && (cd /neo-compiler && git checkout master-2.x && git checkout $COMPILER_COMMIT_NEOCOMPILER)
RUN (cd /neo-compiler/neon && dotnet restore)
RUN (cd /neo-compiler/neon && msbuild /p:Configuration=Release)
RUN (cd /neo-compiler/neon && dotnet publish -f netcoreapp2.0)

#Create standard SC C# project
COPY NeoContractTeste /tmp/

#Adding pre-compiled .dll files
RUN cp /neo-compiler/neon/bin/Release/netcoreapp2.0/* /tmp/NeoContract1/bin/Release/

ARG REPO_DEVPACK
ARG BRANCH_DEVPACK
ARG COMPILER_COMMIT_DEVPACK

#Adding latest Neo.SmartContract.TargetFramework
RUN git clone $REPO_DEVPACK && (cd /neo-devpack-dotnet && git checkout $BRANCH_DEVPACK && git checkout $COMPILER_COMMIT_DEVPACK)
RUN (cd /neo-devpack-dotnet/Neo.SmartContract.Framework && dotnet restore)
RUN (cd /neo-devpack-dotnet/Neo.SmartContract.Framework && msbuild /p:Configuration=Release)
RUN mkdir -p /tmp/packages/Neo.SmartContract.Framework-latest/lib/net40
RUN cp /neo-devpack-dotnet/Neo.SmartContract.Framework/bin/Release/net40/* /tmp/packages/Neo.SmartContract.Framework-latest/lib/net40

ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
