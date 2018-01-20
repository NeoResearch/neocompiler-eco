FROM ubuntu:16.04

RUN apt-get update \
    && apt-get install -y nodejs --no-install-recommends
RUN apt-get -y install mono-complete
RUN apt-get -y install git
RUN git clone https://github.com/neo-project/neo-compiler.git
VOLUME /etc/localtime
#RUN (cd neo-compiler && xbuild)
RUN mkdir -p neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD neon.dll neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD neon.runtimeconfig.json neo-compiler/neon/bin/Release/netcoreapp1.0/
ADD antshares.monocecil.dll neo-compiler/neon/bin/Release/netcoreapp1.0/
RUN export PATH=$PATH:neo-compiler/neon/bin/Release/netcoreapp1.0
RUN mkdir buildtmp
