#!/bin/bash

set -e

# ======================= FIX LOCAL PATHS ====================
# Mount paths must be relative to host docker, even on DooD
# Put your local path on .eco_pwd file: echo $PWD > .eco_pwd 

# check if env $LOCAL_WORKSPACE_FOLDER is defined (vscode)

if [[ -n "$LOCAL_WORKSPACE_FOLDER" ]]; then
    echo -e "$LOCAL_WORKSPACE_FOLDER" > .eco_pwd
elif test -f ".eco_pwd"; then
    echo "LOCAL PATH EXISTS: $(cat .eco_pwd)"
else
    echo "$PWD" > .eco_pwd 
    echo "NO LOCAL PATH EXISTS... SETTING TO $(cat .eco_pwd)"
fi

# check if LOCAL_DOCKER_SOCK variable is defined
if [[ -n "$LOCAL_DOCKER_SOCK" ]]; then
    echo -e "Docker is defined as LOCAL_DOCKER_SOCK=$LOCAL_DOCKER_SOCK"
    if ! test -e "$LOCAL_DOCKER_SOCK"; then
        echo "WARNING: docker socket failed at $LOCAL_DOCKER_SOCK! will proceed anyway..."
    fi
else
    echo -e "LOCAL_DOCKER_SOCK variable is undefined! will fix it!"
    LOCAL_DOCKER_SOCK="/var/run/docker.sock"
    echo "trying default location for docker at $LOCAL_DOCKER_SOCK"
    # check if LOCAL_DOCKER_SOCK socket is working
    echo "checking docker socket: $LOCAL_DOCKER_SOCK"
    if ! test -e "$LOCAL_DOCKER_SOCK"; then
        echo "WARNING: docker socket failed at $LOCAL_DOCKER_SOCK! trying local path..."
        LOCAL_DOCKER_SOCK=/run/user/$UID/docker.sock
        echo "checking docker socket: $LOCAL_DOCKER_SOCK"
        test -e "$LOCAL_DOCKER_SOCK"
    fi
fi
# proceed with docker socket
echo "docker socket seems ok: $LOCAL_DOCKER_SOCK"


# setting .env variables
echo -e "CHAIN=neo-cli-default-empty-chain.acc\nECO_PWD=$(cat .eco_pwd)\nLOCAL_DOCKER_SOCK=$LOCAL_DOCKER_SOCK" > docker-compose-eco-network/.env
echo -e "DOOR_FRONTEND_HTTP=8000\nECO_PWD=$(cat .eco_pwd)" > docker-sock-express-compilers/docker-http-express/.env
echo -e "DOOR_ECOSERVICES=9000\nLOCAL_DOCKER_SOCK=$LOCAL_DOCKER_SOCK\nPWD_CN_BLOCKTIME=neoresearch\nPWD_RESET_SERVICE=dockerreset\nECO_PWD=$(cat .eco_pwd)" \
            > docker-sock-express-compilers/docker-services/.env
echo -e "DOOR_COMPILERS=10000\nBUILD_ALL=0\nBUILD_CSHARP=1\nBUILD_ALL_CSHARP=0\nBUILD_GO=0\nBUILD_BOA=0\nBUILD_JAVA=0\nLOCAL_DOCKER_SOCK=$LOCAL_DOCKER_SOCK\nECO_PWD=$(cat .eco_pwd)" \
            > docker-sock-express-compilers/docker-compilers/.env

# ==============================================================
