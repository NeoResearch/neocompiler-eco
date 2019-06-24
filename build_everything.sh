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

if ((!$DISABLE_BUILD)); then
	if (($DEV_MODE)); then
		echo "BUILDING docker-neo-csharp-node with modified neo-cli (DEV MODE)";
		(cd docker-neo-csharp-node; ./docker_build.sh --neo-cli neo-cli-built.zip)
	else
		echo "BUILDING docker-neo-csharp-node (with default neo-cli)";
		(cd docker-neo-csharp-node; ./docker_build.sh)
	fi
fi

if (($NEO_SCAN)); then
        echo "STOPPPING/BUILDING/RUNNING Docker-compose with a set of components: [4 neo-cli CN + 1RPC watchonly], [neoscan full & postgress]";
	./stopEco_network.sh
	echo "BUILDING using NEO-SCAN";	
	./runEco_network.sh
else
        echo "STOPPPING/BUILDING/RUNNING Docker-compose with a set of components: [4 neo-cli CN + 1RPC watchonly]";
	./stopEco_network.sh
	echo "BUILDING minimal version";
	./runEco_network.sh
fi

echo "BUILDING compilers";
./buildCompilers.sh

# BUILDING, STOPPING AND RUNNING EXPRESS FOR FRONT-END ONLY
if ((!$DISABLE_WEB)); then
	echo "BUILDING front-end";
	(cd docker-http-express; ./docker_build.sh)

	echo "STOPPPING front-end";
	(cd docker-http-express; docker-compose down)

	echo "RUNNING front-end";
	(cd docker-http-express; docker-compose up -d)
fi

echo "RUNNING express servers: compilers and ecoservices";
(cd express-servers; ./startAllExpressNohup.sh)
