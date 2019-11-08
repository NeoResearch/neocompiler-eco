#!/bin/bash
#[[ `docker-compose --version | awk '{print $3}'` == "1.19.0," ]] && echo "docker-compose is ok: 1.19.0" || echo "ERROR: DOCKER COMPOSE VERSION SHOULD BE 1.19.0!"

set -e

source .env
function usage {
    echo "Usage: $0 [--no-build] [--dev] [--no-web]"
}

DISABLE_BUILD=0
DISABLE_WEB=0
DEV_MODE=0
SERVER_MODE=0

while [[ "$#" > 0 ]]; do case $1 in
    -h)
        usage
        exit 0
        ;;
    --no-build)
	echo "PARAMETER DISABLE_BUILD actived.";
        DISABLE_BUILD=1
        shift
        ;;
    --dev)
        DEV_MODE=1
        shift
        ;;
    --no-web)
        DISABLE_WEB=1
        shift
        ;;
    *)
        usage
        exit 1
        ;;
  esac;
done

# ===================== BUILDS ===============================
if ((!$DISABLE_BUILD)); then
	if (($DEV_MODE)); then
		echo "BUILDING docker-neo-csharp-node with modified neo-cli (DEV MODE)";
		(cd docker-neo-csharp-node; ./docker_build.sh --neo-cli neo-cli-built.zip)
	else
		echo "BUILDING docker-neo-csharp-node (with default neo-cli)";
		(cd docker-neo-csharp-node; ./docker_build.sh)
	fi
fi

# BUILDING AND RUNNING EXPRESS FOR FRONT-END ONLY
if ((!$DISABLE_WEB)); then
	echo "BUILDING docker with node express for front-end only";
	(cd docker-http-express; ./docker_build.sh)
fi

echo "BUILDING docker with docker and express";
(cd docker-sock-express-compilers/docker-ubuntu-docker-node-express; ./docker_build.sh)
# ===================== BUILDS  END =========================

echo "TRYING TO STOP all eco related services - including docker services with express servers";
./stopEco_network.sh
./runEco_network.sh

# BUILDING AND RUNNING EXPRESS FOR FRONT-END ONLY
if ((!$DISABLE_WEB)); then
	echo "RUNNING docker with node express for front-end only";
	(cd docker-http-express; docker-compose up -d)
fi

echo "RUNNING express compilers";
(cd docker-sock-express-compilers/docker-compilers; docker-compose up -d)

echo "RUNNING express ecoservice";
(cd docker-sock-express-compilers/docker-services; docker-compose up -d)

echo "EVERYTHING has been built and running!";
