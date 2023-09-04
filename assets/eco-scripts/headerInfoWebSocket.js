function setRefreshingIntervalForHeadersInfo(intervalForRefreshing) {
    if (refreshHeadersNeoCli != 0)
        clearInterval(refreshHeadersNeoCli);

    refreshHeadersNeoCli = setInterval(function() {
        queryHeaderSummary();
    }, intervalForRefreshing);
}

function cleanHeaderSummary() {
    $("#online")[0].innerHTML = "Loading ...";
    $("#nodeRPCHeader")[0].innerHTML = "Loading ...";
}


function queryHeaderSummary() {
    $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getversion", "params": [""] }', function(resultGetVersion) {
        $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }', function(resultBlockCount) {
            $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getrawmempool", "params": [1] }', function(resultRawMemPool) {
                $("#nodeRPCHeader")[0].innerHTML = resultGetVersion.result.useragent;
                NETWORK_MAGIC = resultGetVersion.result.protocol.network;
                $("#nodeRPCHeader")[0].innerHTML += " -> H: " + resultBlockCount.result;
                LAST_BEST_HEIGHT_NEOCLI = resultBlockCount.result;
                $("#nodeRPCHeader")[0].innerHTML += " : " + resultRawMemPool.result.verified.length + "/" + resultRawMemPool.result.unverified.length;
            }); // mempool
        }); // NEO block count
    }); // NEO useragent
}

setRefreshingIntervalForHeadersInfo(2000); //2s