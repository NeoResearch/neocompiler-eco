#!/bin/bash
nohup ./run-CompilerExpress-RPC.sh > ./outputs/nohupCompilers.out 2> ./outputs/nohupCompilers.err < /dev/null &
nohup ./run-EcoServicesExpress-RPC-SocketIo.sh > ./outputs/nohupEcoServices.out 2> ./outputs/nohupEcoServices.err < /dev/null &
nohup ./run-PythonNetworkServices-RPC.sh > ./outputs/nohupPythonServices.out 2> ./outputs/nohupPythonServices.err < /dev/null &
