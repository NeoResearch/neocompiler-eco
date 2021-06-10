function setRefreshingIntervalForHeadersInfo(intervalForRefreshing) {
    if (refreshHeadersNeoCli != 0)
        clearInterval(refreshHeadersNeoCli);

    refreshHeadersNeoCli = setInterval(function() {
        queryHeaderSummary();
    }, intervalForRefreshing);
}

function queryHeaderSummary() {

    /*
    $.ajax({
        type: 'POST',
        url: BASE_PATH_CLI,
        crossDomain: true,
        data: '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }',
        dataType: 'json',
        success: function(responseData, textStatus, jqXHR) {
            console.log(responseData);
        },
        error: function(responseData, textStatus, errorThrown) {
            alert('POST failed.');
        }
    });*/


    $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getversion", "params": [""] }', function(resultGetVersion) {
        $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }', function(resultBlockCount) {
            $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getrawmempool", "params": [1] }', function(resultRawMemPool) {
                $("#nodeRPCHeader")[0].innerHTML = resultGetVersion.result.useragent;
                NETWORK_MAGIC = resultGetVersion.result.network;
                $("#nodeRPCHeader")[0].innerHTML += " -> H: " + resultBlockCount.result;
                LAST_BEST_HEIGHT_NEOCLI = resultBlockCount.result;
                $("#nodeRPCHeader")[0].innerHTML += " : " + resultRawMemPool.result.verified.length + "/" + resultRawMemPool.result.unverified.length;
            }); // mempool
        }); // NEO block count
    }); // NEO useragent
}

setRefreshingIntervalForHeadersInfo(800); //0.8s
startSocketIoConnections();