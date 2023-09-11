function setRefreshingIntervalForHeadersInfo(intervalForRefreshing) {
    if (refreshHeadersNeoCli != 0)
        clearInterval(refreshHeadersNeoCli);

    refreshHeadersNeoCli = setInterval(function() {
        queryHeaderSummary();
    }, intervalForRefreshing);
}

function cleanVersionHeightSummary() {
    //$("#online")[0].innerHTML = "<i class='fas fa-lg fa-spinner'></i>";
    $("#nodeVersion")[0].innerHTML = "<i class='fas fa-lg fa-spinner'></i>";
    $("#nodeHeight")[0].innerHTML = "<i class='fas fa-lg fa-spinner'></i>";
}

function changeRPCHeaderURL() {
    cleanVersionHeightSummary();

    var boxID = "rpc_nodes_list";
    var currentIndex = document.getElementById(boxID).selectedIndex;
    var newBasePathCli = document.getElementById(boxID)[currentIndex].value;
    $("#nodeURL")[0].innerHTML = newBasePathCli;
    BASE_PATH_CLI = newBasePathCli;
}

function queryHeaderSummary() {
    $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getversion", "params": [""] }', function(resultGetVersion) {
        $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }', function(resultBlockCount) {
            $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getrawmempool", "params": [1] }', function(resultRawMemPool) {
                $("#nodeVersion")[0].innerHTML = "<b>Version: </b>" +resultGetVersion.result.useragent;
                NETWORK_MAGIC = resultGetVersion.result.protocol.network;
                $("#nodeHeight")[0].innerHTML = "<b>Block: </b>" + resultBlockCount.result;
                LAST_BEST_HEIGHT_NEOCLI = resultBlockCount.result;
                $("#nodeHeight")[0].innerHTML += " - <b>MemPool:</b> " + resultRawMemPool.result.verified.length + "|" + resultRawMemPool.result.unverified.length;
            }); // mempool
        }); // NEO block count
    }); // NEO useragent
}