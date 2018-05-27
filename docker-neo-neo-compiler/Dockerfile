FROM ubuntu:18.04

LABEL maintainer="NeoResearch"
LABEL authors="imcoelho,vncoelho"

RUN apt-get update \
    && apt-get install -y nodejs --no-install-recommends
RUN apt-get install -y gnupg2 gnupg gnupg1
RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 3FA7E0328081BFF6A14DA29AA6A19B38D3D831EF
RUN echo "deb https://download.mono-project.com/repo/ubuntu stable-bionic main" | tee /etc/apt/sources.list.d/mono-official-stable.list
RUN apt-get update && apt-get install -y mono-complete
#RUN apt-get -y install mono-complete
RUN apt-get -y install git nano curl wget
RUN apt-get update && apt-get install -y msbuild

RUN wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.asc.gpg
RUN mv microsoft.asc.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
RUN wget -q https://packages.microsoft.com/config/ubuntu/18.04/prod.list
RUN mv prod.list /etc/apt/sources.list.d/microsoft-prod.list

# TODO FIX: using artful (17.10) instead of bionic (18.04) for dotnet-sdk (it seems that 18.04 don't have dotnet-sdk-2.1.4)
#RUN curl https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor > microsoft.gpg
#RUN mv microsoft.gpg /etc/apt/trusted.gpg.d/microsoft.gpg
#RUN sh -c 'echo "deb [arch=amd64] https://packages.microsoft.com/repos/microsoft-ubuntu-artful-prod artful main" > /etc/apt/sources.list.d/dotnetdev.list'
#RUN wget https://packages.microsoft.com/config/ubuntu/17.10/packages-microsoft-prod.deb -O packages-microsoft-prod.deb
#RUN dpkg -i packages-microsoft-prod.deb

RUN apt-get update && apt-get install -y apt-transport-https
RUN apt-get update && apt-get install -y dotnet-sdk-2.1.200 #dotnet-sdk-2.1.300*

ADD CompileScript.sh /CompileScript.sh
ENTRYPOINT /CompileScript.sh
