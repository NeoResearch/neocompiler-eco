#!/bin/bash

echo "BUILDING/RUNNING Docker-compose with a set of components: Neo-CSharp-Nodes,NeoScan and Neo-Python";
# buildRun_Compose_PrivateNet_NeoScanDocker.sh already forces everything down
# (cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh down)
(cd dockers-neo-scan-neon; ./buildRun_Compose_PrivateNet_NeoScanDocker.sh)

