#!/bin/bash
#[[ `docker-compose --version | awk '{print $3}'` == "1.19.0," ]] && echo "docker-compose is ok: 1.19.0" || echo "ERROR: DOCKER COMPOSE VERSION SHOULD BE 1.19.0!"

set -e

function usage {
    echo "Usage: $0 [--no-build] [--dev] [--server-mode]"
}

DISABLE_BUILD=0
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
    *)
        usage
        exit 1
        ;;
  esac;
done

if ((!$DISABLE_BUILD)); then
	echo "BUILDING ubuntu-dotnet for a correct docker-neo-csharp-node initialization";
	(cd docker-ubuntu-dotnet; ./docker_build.sh)

	if (($DEV_MODE)); then
		echo "BUILDING docker-neo-csharp-node with modified neo-cli (DEV MODE)";
		(cd docker-neo-csharp-node; ./docker_build.sh --neo-cli neo-cli-built.zip)
	else
		echo "BUILDING docker-neo-csharp-node (with default neo-cli)";
		(cd docker-neo-csharp-node; ./docker_build.sh)
	fi

	echo "BUILDING docker-neo-compiler-neo-python";
	(cd docker-neo-python; ./docker_build.sh)
fi


echo "STOPPPING/BUILDING/RUNNING Docker-compose with a set of components: [csharp nodes], [csharp rpc], [neoscan and postgress], [Neo-Python Rest, Notifications and Genesis transfer]";
./stopEco_network.sh
./runEco_network.sh

echo "BUILDING compilers";
./buildCompilers.sh

echo "RUNNING express servers: front-end, compilers and ecoservices";
nohup ./runHttpExpress.sh > ./express-servers/outputs/nohupOutputRunHttpExpress.out 2> ./express-servers/outputs/nohupOutputRunHttpExpress.err < /dev/null &
(cd express-servers; ./startAllExpressNohup.sh)
