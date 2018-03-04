#!/bin/bash
echo "Ensuring that docker-compose is down (no reestart will be possible)";
./buildRun_Compose_PrivateNet_NeoScanDocker.sh down
echo "BUILDING/RUNNING Private Net with NeoScan-Docker";
./buildRun_Compose_PrivateNet_NeoScanDocker.sh
echo "NeoScan-Docker Built with Sucess. You will probably need to wait some time until NeoScan is fully sync.";
echo "BUILDING/RUNNING web interface and csharp compiler";
./buildRun_WebInterface_CSharpCompiler.sh
