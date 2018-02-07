FROM ubuntu:17.10

RUN apt-get update \
    && apt-get install -y nodejs --no-install-recommends
RUN apt-get -y install mono-complete
RUN apt-get -y install git nano curl
RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
RUN mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-artful-prod artful main" > /etc/apt/sources.list.d/dotnetdev.list'
#RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-zesty-prod zesty main" > /etc/apt/sources.list.d/dotnetdev.list'
RUN apt-get install -y apt-transport-https
RUN apt-get update && apt-get install -y dotnet-sdk-2.1.4
RUN git clone https://github.com/neo-project/neo-compiler.git
#VOLUME /etc/localtime
#RUN (cd neo-compiler && xbuild)
RUN mkdir -p neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD Neon/neon.dll neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD Neon/neon.runtimeconfig.json neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD Neon/antshares.monocecil.dll neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD Neon/Neo.VM.dll neo-compiler/neon/bin/Release/netcoreapp1.0/
#RUN export PATH=$PATH:neo-compiler/neon/bin/Release/netcoreapp1.0
RUN mkdir buildtmp
COPY NeoContractTeste buildtmp/
RUN apt-get -y install xxd
ADD entrypoint.sh /entrypoint.sh
ENTRYPOINT /entrypoint.sh
