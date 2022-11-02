//===============================================================
var MAX_BLOCKS_SCREEN = 10;
var CURRENT_BLOCKS = [];
var tableBlocks = document.createElement("tbody");

function drawBlocks(end = -1, count = -1) {
    // Clean blocks cache
    CURRENT_BLOCKS = [];

    if (end == -1) {
        end = LAST_BEST_HEIGHT_NEOCLI - 1;
        count = MAX_BLOCKS_SCREEN;
    }

    for (b = end; b > (end - count); b--) {
        var param = "[" + b + "," + 1 + "]";
        console.log("block: " + b);
        $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblock", "params": ' + param + ' } ', function (resultBlock) {
            console.log(resultBlock)
            var blockIndex = resultBlock.result.index;
            CURRENT_BLOCKS.push({
                index: blockIndex,
                block: resultBlock
            });
            CURRENT_BLOCKS.sort(function compare(a, b) {
                if (a.index > b.index) return -1;
                if (a.index < b.index) return 1;
                return 0;
            })
            cleanTableBlocks();
            printBlocksToTable();
        });
    } //Finishes loop that draws each relayed transaction

} //Finishes Draw Relayed TXs
//===============================================================

function cleanTableBlocks() {
    //Clean table
    tableBlocks = document.createElement("tbody");

    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headers1 = document.createElement('td');
    var headers2 = document.createElement('td');
    var headers3 = document.createElement('td');
    var headers4 = document.createElement('td');

    headers1.innerHTML = "<b><center><font size='1'>Index</font></b>";
    headerRow.insertCell(-1).appendChild(headers1);
    headers2.innerHTML = "<b><center><font size='1'>Time</font></b>";
    headerRow.insertCell(-1).appendChild(headers2);
    headers3.innerHTML = "<b><center><font size='1'>Txs.</font></b>";
    headerRow.insertCell(-1).appendChild(headers3);
    headers4.innerHTML = "<b><center><font size='1'>Size</font></b>";
    headerRow.insertCell(-1).appendChild(headers4);

    tableBlocks.appendChild(headerRow);

    //Clear previous data
    document.getElementById("tableBlocks").innerHTML = "";
    //Append new table
    document.getElementById("tableBlocks").appendChild(tableBlocks);
}

function printBlocksToTable() {
    for (b = 0; b < CURRENT_BLOCKS.length; b++) {
        var block = CURRENT_BLOCKS[b].block;
        var index = block.result.index;
        var hash = block.result.hash;
        var size = block.result.size;
        var time = block.result.time;
        var ntxs = block.result.tx.length;

        var txRow = tableBlocks.insertRow(-1);
        var blockIndex = document.createElement('button');
        blockIndex.setAttribute('content', 'test content');
        blockIndex.setAttribute('class', 'btn btn-success btn-sm');
        blockIndex.setAttribute('value', index);
        blockIndex.setAttribute('id', "btnIndex" + index);
        blockIndex.onclick = function () {
            callBlockLog(index);
        };
        blockIndex.innerHTML = index;
        txRow.insertCell(-1).appendChild(blockIndex);

        var timeCell = document.createElement('span');
        timeCell.setAttribute("class", "badge");
        timeCell.textContent = (Date.now() - time) / 1000 + " seconds ago";
        txRow.insertCell(-1).appendChild(timeCell);

        var nTxsCell = document.createElement('span');
        nTxsCell.setAttribute("class", "badge");
        nTxsCell.textContent = ntxs;
        txRow.insertCell(-1).appendChild(nTxsCell);

        var sizeCell = document.createElement('span');
        sizeCell.setAttribute("class", "badge");
        sizeCell.textContent = size + " Bytes";
        txRow.insertCell(-1).appendChild(sizeCell);
    }
}

function callBlockLog(blockIndex) {
    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getblock",
        "params": [blockIndex,1]
    };

    goToTabAndInvokeRPC(jsonForInvokingFunction);
}