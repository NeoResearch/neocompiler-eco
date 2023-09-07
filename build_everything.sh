#!/bin/bash

set -e

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

# MUST SETUP ALL .env FILES FOR docker compose
./setup_env.sh

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


echo "BUILDING docker with docker and express";
(cd docker-sock-express-compilers/docker-ubuntu-docker-node-express; ./docker_build-all.sh)

echo "BUILDING compilers";
(cd docker-sock-express-compilers/docker-compilers; ./buildCompilers.sh)
# ===================== BUILDS  END =========================

# ===================== STOP EVERYTHING =========================
echo "STOPPING containers";
./stop_everything.sh
# ===================== STOP EVERYTHING =========================

echo "Call docker-compose network";
(cd docker-compose-eco-network; ./runDetachedCompose-EcoNodes.sh)

# BUILDING AND RUNNING EXPRESS FOR FRONT-END ONLY
if ((!$DISABLE_WEB)); then
	echo "RUNNING docker with node express for front-end only";
	(cd docker-sock-express-compilers/docker-http-express; docker compose up -d)
fi

echo "RUNNING express ecoservice";
(cd docker-sock-express-compilers/docker-services; docker compose up -d)

echo "RUNNING express compilers";
(cd docker-sock-express-compilers/docker-compilers; docker compose up -d)

echo "EVERYTHING has been built and running!";