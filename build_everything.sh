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


if ((!$DISABLE_BUILD)); then
	echo "BUILDING docker-compiler-csharpnodes";
	(cd docker-neo-csharp-nodes; ./docker_build.sh)

	echo "BUILDING docker-neo-compiler-neo-python";
	(cd docker-neo-python; ./docker_build.sh)
fi

if (($DEV_MODE)); then
	echo "(DEV MODE) BUILDING modified neo-cli";
	(cd eco-lab-opt-tests/docker-build-neo-cli; ./docker_build_run_copy_stop.sh)

	echo "(DEV MODE) BUILDING docker-compiler-csharpnodes with modified neo-cli";
	(cd eco-lab-opt-tests; ./build_neo_csharp_nodes_with_builtNeoCli.sh)
fi

# dockerCompose script already puts down
# echo "Ensuring that any docker-composes is down (no reestart will be possible)";
# ./stop-all-docker-compose.sh

if (($DEV_MODE)); then
	echo "(DEV MOD) BUILDING/RUNNING Neo-CSharp-Nodes with NeoScan-Docker (docker-compose with images from hub.docker)";
	(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)

else
	echo "BUILDING/RUNNING Neo-CSharp-Nodes with NeoScan-Docker (docker-compose with images from hub.docker)";
	(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)
fi

echo "PROCEEDING. NeoCompiler Eco(system) has been built!";

echo "BUILDING/RUNNING web interface and compilers";
./buildRun_WebInterface_Compilers.sh
