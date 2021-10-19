#!/bin/bash

echo ""
echo "============= performing neocompiler-eco library tests =============="
echo ""
npm install
nohup npm run serve&
npm test
pkill http-server #finish server
