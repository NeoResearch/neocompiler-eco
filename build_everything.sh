#!/bin/bash
[[ `docker-compose --version | awk '{print $3}'` == "1.19.0," ]] && echo "docker-compose is ok: 1.19.0" || echo "ERROR: DOCKER COMPOSE VERSION SHOULD BE 1.19.0!"

set -e

function usage {
    echo "Usage: $0 [--no-build] [--dev]"
}

DISABLE_BUILD=0
DEV_MODE=0

while [[ "$#" > 0 ]]; do case $1 in
    -h)
        usage
        exit 0
        ;;
    --no-build)
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


echo "Ensuring that any docker-composes is down (no reestart will be possible)";
./stop-all-docker-compose.sh

if ((!$DISABLE_BUILD)); then
	echo "BUILDING docker-compiler-csharpnodes";
	(cd docker-neo-csharp-nodes; ./docker_build.sh)

	echo "BUILDING docker-neo-compiler-neo-python";
	(cd docker-neo-python; ./docker_build.sh)
fi

if (($DEV_MODE)); then
	echo "(DEV MOD) ......";
else
	echo "BUILDING/RUNNING Neo-CSharp-Nodes with NeoScan-Docker (docker-compose with images from hub.docker)";
	(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)
fi

echo "PROCEEDING. NeoScan-Docker Built with BUILT and, probably, RUNNING. You will probably need to wait some time until NeoScan is fully sync.";

echo "BUILDING/RUNNING web interface and compilers";
./buildRun_WebInterface_Compilers.sh

# Old command that was used before our private Hub-docker images
#echo "EXECUTE TransferScript on PrivateNet";
#docker exec -d -t neo-compiler-privnet-with-gas dash -i -c "./execTransferFundsAtTheBegin.sh"
