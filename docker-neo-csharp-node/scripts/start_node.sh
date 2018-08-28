#!/bin/bash
cd /opt/node/neo-cli/

if (($IS_RPC)); then
	(cd /opt/node/neo-cli/; dotnet neo-cli.dll --rpc --log)
else
	(cd /opt/node/neo-cli/; dotnet neo-cli.dll --log)
fi
