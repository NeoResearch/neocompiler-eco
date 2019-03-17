#!/bin/bash
# Call script to stop HTTP server
./stopHttpExpress.sh

#Eco Services
(cd express-servers; ./stop-Compiler-EcoServices-Express-RPC.sh)
