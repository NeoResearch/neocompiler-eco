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

    for (b = end; b >= Math.max((end - count), 0); b--) {
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
        var txRow = tableBlocks.insertRow(-1);

        var block = CURRENT_BLOCKS[b].block;
        var index = block.result.index;
        var size = block.result.size;
        var time = block.result.time;

        var blockIndex = document.createElement('button');
        blockIndex.setAttribute('content', 'test content');
        blockIndex.setAttribute('class', 'btn btn-success btn-sm');
        blockIndex.setAttribute('value', index);
        blockIndex.setAttribute('id', "btnIndex" + index);
        blockIndex.onclick = function () {
            callBlockLog(parseInt(this.value));
        };
        blockIndex.innerHTML = index;
        txRow.insertCell(-1).appendChild(blockIndex);

        var timeCell = document.createElement('span');
        timeCell.setAttribute("class", "badge");
        timeCell.textContent = (Date.now() - time) / 1000 + " seconds ago";
        txRow.insertCell(-1).appendChild(timeCell);

        var ntxs = block.result.tx.length;

        if (ntxs == 0) {
            var nTxsCell = document.createElement('span');
            nTxsCell.setAttribute("class", "badge");
            nTxsCell.textContent = ntxs;
            txRow.insertCell(-1).appendChild(nTxsCell);
        } else {
            var txExpandButton = document.createElement('button');
            txExpandButton.setAttribute('content', 'test content');
            txExpandButton.setAttribute('class', 'btn btn-success btn-sm');
            txExpandButton.setAttribute('value', b);
            txExpandButton.setAttribute('id', "btnTxs" + ntxs);
            txExpandButton.onclick = function () {
                hideUnhideTxs(this.value);
            };
            txExpandButton.innerHTML = ntxs;
            txRow.insertCell(-1).appendChild(txExpandButton);

            expandTxs(b);
        }

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
        "params": [blockIndex, 1]
    };

    goToTabAndInvokeRPC(jsonForInvokingFunction);
}

function expandTxs(bIndex) {
    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";

    var headersempty = document.createElement('td');
    headersempty.innerHTML = "<b><center><font size='1'></font></b>";
    headerRow.insertCell(-1).appendChild(headersempty);

    var headers1 = document.createElement('td');
    headers1.innerHTML = "<b><center><font color='#00AF92' size='1'>Hash</font></b>";
    headerRow.insertCell(-1).appendChild(headers1);

    var headers2 = document.createElement('td');
    headers2.innerHTML = "<b><center><font color='#00AF92' size='1'>Size</font></b>";
    headerRow.insertCell(-1).appendChild(headers2);

    var headers3 = document.createElement('td');
    headers3.innerHTML = "<b><center><font color='#00AF92' size='1'>netfee</font></b>";
    headerRow.insertCell(-1).appendChild(headers3);

    var headers4 = document.createElement('td');
    headers4.innerHTML = "<b><center><font color='#00AF92' size='1'>sysfee</font></b>";
    headerRow.insertCell(-1).appendChild(headers4);

    var headers5 = document.createElement('td');
    headers5.innerHTML = "<b><center><font color='#00AF92' size='1'>nWit</font></b>";
    headerRow.insertCell(-1).appendChild(headers5);

    var headers6 = document.createElement('td');
    headers6.innerHTML = "<b><center><font color='#00AF92' size='1'>nonce</font></b>";
    headerRow.insertCell(-1).appendChild(headers6);

    tableBlocks.appendChild(headerRow);
    tableBlocks.rows[tableBlocks.rows.length - 1].hidden = true;

    nTxs = CURRENT_BLOCKS[bIndex].block.result.tx.length;

    var arrayTxsHiddenRows = [];
    for (var i = tableBlocks.rows.length; i <= tableBlocks.rows.length + nTxs; i++) {
        arrayTxsHiddenRows.push(i - 1);
    }
    CURRENT_BLOCKS[bIndex]["arrayTxsHiddenRows"] = arrayTxsHiddenRows;

    for (tx = 0; tx < nTxs; tx++) {
        var cTx = CURRENT_BLOCKS[bIndex].block.result.tx[tx];
        var txRow = tableBlocks.insertRow(-1);

        //Empty empty cell
        var emptyCell = document.createElement('span');
        txRow.insertCell(-1).appendChild(emptyCell);

        var hash = cTx.hash;
        var txHash = document.createElement('button');
        txHash.setAttribute('content', 'test content');
        txHash.setAttribute('class', 'btn btn-info btn-sm');
        txHash.setAttribute('value', hash);
        txHash.setAttribute('id', "btnHash" + hash);
        txHash.onclick = function () {
            callTxHash(this.value);
        };
        txHash.innerHTML = hash.slice(hash.length - 4) + "..." + hash.slice(-4);
        txRow.insertCell(-1).appendChild(txHash);

        var size = cTx.size;
        var sizeCell = document.createElement('span');
        sizeCell.setAttribute("class", "badge");
        sizeCell.textContent = size;
        txRow.insertCell(-1).appendChild(sizeCell);

        var netfee = cTx.netfee;
        var netfeeCell = document.createElement('span');
        netfeeCell.setAttribute("class", "badge");
        netfeeCell.textContent = parseInt(netfee) / 100000000 + " GAS";
        txRow.insertCell(-1).appendChild(netfeeCell);

        var sysfee = cTx.sysfee;
        var sysfeeCell = document.createElement('span');
        sysfeeCell.setAttribute("class", "badge");
        sysfeeCell.textContent = parseInt(sysfee) / 100000000 + " GAS";
        txRow.insertCell(-1).appendChild(sysfeeCell);

        var nWit = cTx.witnesses.length;
        var nWitCell = document.createElement('span');
        nWitCell.setAttribute("class", "badge");
        nWitCell.textContent = nWit;
        txRow.insertCell(-1).appendChild(nWitCell);

        var nonce = cTx.nonce;
        var nonceCell = document.createElement('span');
        nonceCell.setAttribute("class", "badge");
        nonceCell.textContent = nonce;
        txRow.insertCell(-1).appendChild(nonceCell);
        tableBlocks.rows[tableBlocks.rows.length - 1].hidden = true;
    }
}

function callTxHash(txHash) {
    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getapplicationlog",
        "params": [txHash]
    };

    goToTabAndInvokeRPC(jsonForInvokingFunction);
}

function hideUnhideTxs(bIndex) {
    var restoredHiddenRows = CURRENT_BLOCKS[bIndex]["arrayTxsHiddenRows"];
    console.log(restoredHiddenRows);
    nTxs = CURRENT_BLOCKS[bIndex].block.result.tx.length;
    for (i = 0; i < restoredHiddenRows.length; i++) {        
        tableBlocks.rows[restoredHiddenRows[i]].hidden = !tableBlocks.rows[restoredHiddenRows[i]].hidden;
    }
}