#!/bin/bash
[[ `docker-compose --version | awk '{print $3}'` == "1.19.0," ]] && echo "docker-compose is ok: 1.19.0" || echo "ERROR: DOCKER COMPOSE VERSION SHOULD BE 1.19.0!"

echo "Ensuring that docker-compose is down (no reestart will be possible)";
./buildRun_Compose_PrivateNet_Neon_NeoScanDocker.sh down

echo "BUILDING/RUNNING Private Net with NeoScan-Docker";
./buildRun_Compose_PrivateNet_Neon_NeoScanDocker.sh
echo "NeoScan-Docker Built with Sucess. You will probably need to wait some time until NeoScan is fully sync.";

#echo "EXECUTE TransferScript on PrivateNet";
#docker exec -d -t neo-compiler-privnet-with-gas dash -i -c "./execTransferFundsAtTheBegin.sh"

echo "BUILDING/RUNNING web interface and csharp compiler";
./buildRun_WebInterface_CSharpCompiler.sh
