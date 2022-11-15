function changeSelectedNetwork() {
    var selectedNetwork = $("#ecolabnetworkurlselection")[0].selectedIndex;
    //console.log(selectedNetwork);
    switch (selectedNetwork) {
        case 0:
            default_nodes = ecoNodes
            break;
        case 1:
            default_nodes = localHostNodes
            break;
        case 2:
            default_nodes = testnetNodes
            break;
        case 3:
            default_nodes = mainnetNodes
            break;
        default:
            console.error(`Sorry, we are out of options for selected network.`);
    }
    BASE_PATH_CLI_NODES = getAllAvailableService("RPC", default_nodes);
    BASE_PATH_CLI = BASE_PATH_CLI_NODES[0];

    BASE_PATH_ECOSERVICES = getFirstAvailableService("ecoservices", default_nodes);

    // Update native and deployed
    NATIVE_CONTRACTS = [];
    NOTIFICATIONS_SEARCHED_CONTRACTS = [];
    getNativeInfo();
}

function pickBestAvailableRpcNeoNodeCSharpByBlock() {
    if (AUTOMATIC_PIC_CSHARP_NODE_BEST_HEIGHT) {
        var availableNodes = BASE_PATH_CLI_NODES.length;
        var bestNode = BASE_PATH_CLI;
        var bestHeight = LAST_BEST_HEIGHT_NEOCLI;
        var maxNumberOfNodesToTry = Math.min(3, availableNodes);
        var mapRandomNodes = new Map();
        for (var t = 0; t < maxNumberOfNodesToTry; t++) {
            var randomNode = Math.floor(Math.random() * maxNumberOfNodesToTry);
            while (mapRandomNodes.has(randomNode))
                randomNode = Math.floor(Math.random() * maxNumberOfNodesToTry);
            mapRandomNodes.set(randomNode, "true");
            var neoCliNodeToGetHeight = BASE_PATH_CLI_NODES[randomNode].value;
            requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": " + randomNode + ", \"method\": \"getblockcount\", \"params\": [\"\"] }";
            //console.log(requestJson);

            $.post(
                neoCliNodeToGetHeight, // Gets the URL to sent the post to
                requestJson, // Serializes form data in standard format
                function (resultJsonData) {
                    NUMBER_FAILS_REQUESTS = 0;
                    //console.log(resultJsonData);
                    var nodeHeight = resultJsonData.result;
                    var nodeId = resultJsonData.id;
                    if (nodeHeight > bestHeight) {
                        bestHeight = nodeHeight;
                        bestNode = nodeId;
                        if (bestNode != BASE_PATH_CLI) {
                            //console.log("Going to update to bestNode " + bestNode + " at height " + nodeHeight);
                            BASE_PATH_CLI = BASE_PATH_CLI_NODES[nodeId].value;
                        }
                    }
                },
                "json" // The format the response should be in
            ).fail(function () {
                console.error('Could not call the api of node URL', neoCliNodeToGetHeight);
            }); //End of POST for search
        }
    } //automatic node checkbox
}