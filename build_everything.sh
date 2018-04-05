#!/bin/bash
[[ `docker-compose --version | awk '{print $3}'` == "1.19.0," ]] && echo "docker-compose is ok: 1.19.0" || echo "ERROR: DOCKER COMPOSE VERSION SHOULD BE 1.19.0!"

echo "Ensuring that any docker-composes is down (no reestart will be possible)";
./stop-all-docker-compose.sh

if (( $# != 0 )); then
	echo "BUILDING docker-compiler-privnet (OPTIONAL - normally used during developing, provide any additional parameter to this script file)";
	(cd docker-privnet; ./docker_build.sh)
	echo "PROCEEDING. docker-compiler-privnet was BUILT (OPTIONAL - normally used during developing, provide any additional parameter to this script file)";
fi

echo "BUILDING/RUNNING Private Net with NeoScan-Docker";
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)
echo "PROCEEDING. NeoScan-Docker Built with BUILT and, probably, RUNNING. You will probably need to wait some time until NeoScan is fully sync.";

echo "PRUNE any useless NPM dep and install";
npm prune
echo "NPM Install";
npm install

echo "BUILDING/RUNNING web interface and csharp compiler";
./buildRun_WebInterface_CSharpCompiler.sh

# Old command that was used before our private Hub-docker images
#echo "EXECUTE TransferScript on PrivateNet";
#docker exec -d -t neo-compiler-privnet-with-gas dash -i -c "./execTransferFundsAtTheBegin.sh"
