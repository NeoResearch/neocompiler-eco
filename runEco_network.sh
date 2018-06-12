#!/bin/bash

echo "BUILDING/RUNNING Neo-CSharp-Nodes with NeoScan-Docker (docker-compose with images from hub.docker)";
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh down)
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)

