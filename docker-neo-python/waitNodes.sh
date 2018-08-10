while true; do
    cnt=`curl -s -X POST $CSHARP_NODES_CONTAINER_NAME:30333 -H 'Content-Type: application/json' -d '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [] }'`
    echo $cnt
    resultWasSent=`echo $cnt | grep "result"`
    if [ $? -eq 0 ]; then
      break
    fi
    sleep 2
done
