//===============================================================
var MAX_BLOCKS_SCREEN = 10;
var CURRENT_BLOCKS = [];
var PROGRESS;
var tableBlocks = document.createElement("tbody");

// This searchers address or TX hash
function searchAsAScan() {
    var searchValue = $(search_blockchain)[0].value;

    if (searchValue == "") {
        swal2Simple("Searching Block", "Invalid value to search. Enter address or TX Hash or index", 5500, "error");
        return;
    }

    //Is address
    if (Neon.wallet.isAddress(searchValue)) {
        console.log("Address is: " + searchValue);
        goToTabAndClick("nav-rpc");
        $("#txtRPCJson").val("{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getnep17balances\", \"params\": [\"" + searchValue + "\"] }");
        rawRpcCall();
        return;
    }

    //Tx Hash
    if (searchValue.length == 66) {
        console.log("Tx hash is: " + searchValue);
        goToTabAndClick("nav-rpc");
        $("#txtRPCJson").val("{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getapplicationlog\", \"params\": [\"" + searchValue + "\"] }");
        rawRpcCall();
        return;
    }

    //Index Hash
    var possibleHeight = Number(searchValue);
    var maxHeight = 1000000000; // 1 billion
    if (possibleHeight >= 0 && possibleHeight < maxHeight) {
        console.log("Tx hash is: " + searchValue);
        $("#blocks_end_get")[0].value = searchValue;
        $("#blocks_count_get")[0].value = 0;
        cleanTableBlocks();
        drawBlocks();
        return;
    }
}

function drawBlocks(automatic = false) {
    // automatic is just when you click on the tab. Avoid to redo the search
    if (automatic)
        if (CURRENT_BLOCKS.length > 0)
            return;

    // Clean blocks cache
    CURRENT_BLOCKS = [];

    end = parseInt($("#blocks_end_get")[0].value);
    count = parseInt($("#blocks_count_get")[0].value);

    if (isNaN(end) && isNaN(count)) {
        count = MAX_BLOCKS_SCREEN;
        end = LAST_BEST_HEIGHT_NEOCLI - 1;
        // Usually when initialized
        if (count > end)
            count = 0;
    }

    if (!isNaN(end) && isNaN(count)) {
        count = 0;
        $("#blocks_count_get")[0].value = count;
    }

    if (isNaN(end) && !isNaN(count)) {
        end = LAST_BEST_HEIGHT_NEOCLI - 1;
        $("#blocks_end_get")[0].value = end;
    }

    if (count < 0) {
        count = 0;
        $("#blocks_count_get")[0].value = count;
    }

    if (end < 0) {
        end = 0;
        $("#blocks_end_get")[0].value = end;
    }

    if (!isNaN(count) && !isNaN(end)) {
        if (count > end) {
            swal2Simple("Invalid parameter for count", "Count should be lower than end!", 5500, "error");
            return;
        }
    }

    var maxQueriedBlocks = 1000;
    if (count > maxQueriedBlocks) {
        var sText = "You should query less blocks. " + "Count should be lower than" + maxQueriedBlocks;
        swal2Simple("Blocks queries error", sText, 5500, "error");
        return;
    }

    // Add count fail otherwise it is not printed sometimes if post fails
    PROGRESS = { c: 0, count: count, f: 0 }
    cleanTableBlocks();

    for (b = end; b >= Math.max((end - count), 0); b--) {
        var param = "[" + b + "," + 1 + "]";
        $.post(BASE_PATH_CLI, '{ "jsonrpc": "2.0", "id": 5, "method": "getblock", "params": ' + param + ' } ', function (resultBlock) {
            PROGRESS.c++;
            var percentageComplete = Math.round(Math.min(100, PROGRESS.c / PROGRESS.count * 100));
            $("#progressBarBlocks")[0].style.width = percentageComplete + "%";
            $("#progressBarBlocksText").html(percentageComplete + "% complete");

            if (resultBlock.error)
                if (resultBlock.error.code === -100) {
                    cleanTableBlocks();
                    printBlocksToTable(resultBlock.error.message);
                    return;
                }

            var blockIndex = resultBlock.result.index;
            CURRENT_BLOCKS.push({
                index: blockIndex,
                block: resultBlock
            });
        }).fail(function () {
            PROGRESS.f++;
            console.log("Failed requested for blocks: " + PROGRESS.f);
        }).always(function () {
            if ((PROGRESS.c + PROGRESS.f) > PROGRESS.count) {
                CURRENT_BLOCKS.sort(function compare(a, b) {
                    if (a.index > b.index) return -1;
                    if (a.index < b.index) return 1;
                    return 0;
                })
                if (CURRENT_BLOCKS.length != 0)
                    printBlocksToTable();
                else
                    printBlocksToTable("Error when searching for these blocks.");
            }
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

    headers1.innerHTML = "<b><center><font size='1'>INDEX</font></b>";
    headerRow.insertCell(-1).appendChild(headers1);
    headers2.innerHTML = "<b><center><font size='1'>TIME</font></b>";
    headerRow.insertCell(-1).appendChild(headers2);
    headers3.innerHTML = "<b><center><font size='1'>TXS.</font></b>";
    headerRow.insertCell(-1).appendChild(headers3);
    headers4.innerHTML = "<b><center><font size='1'>SIZE</font></b>";
    headerRow.insertCell(-1).appendChild(headers4);

    tableBlocks.appendChild(headerRow);

    //Clear previous data
    document.getElementById("tableBlocks").innerHTML = "";
    //Append new table
    document.getElementById("tableBlocks").appendChild(tableBlocks);
}


function timeSince(timeInPast) {
    var timeDiffMessage = "";
    var delta = Math.abs(Date.now() - timeInPast) / 1000;

    // get days
    var days = Math.floor(delta / 86400);
    delta -= days * 86400;
    if (days != 0)
        timeDiffMessage += days + "d ";

    // get hours
    var hours = Math.floor(delta / 3600) % 24;
    delta -= hours * 3600;
    if (hours != 0 || days != 0)
        timeDiffMessage += hours + "h "

    // get minutes
    var minutes = Math.floor(delta / 60) % 60;
    delta -= minutes * 60;
    if (hours != 0 || days != 0 || minutes != 0)
        timeDiffMessage += minutes + "m "

    // get seconds left
    var s = Math.round(delta % 60);
    timeDiffMessage += s + "s";

    return timeDiffMessage;
}

function printBlocksToTable(errorMsg = "") {
    var printedBlocks = 0;
    var minTxsToPrint = Number($("#blocks_count_get_min_tx")[0].value);

    for (b = 0; b < CURRENT_BLOCKS.length; b++) {
        var block = CURRENT_BLOCKS[b].block;
        var ntxs = block.result.tx.length;

        if (ntxs < minTxsToPrint)
            continue;
        printedBlocks++

        var txRow = tableBlocks.insertRow(-1);


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
        var timeDifferenceMessage = timeSince(time);
        timeCell.textContent = timeDifferenceMessage;
        txRow.insertCell(-1).appendChild(timeCell);

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
    if (printedBlocks == 0) {
        var txRow = tableBlocks.insertRow(-1);
        var sizeCell = document.createElement('span');
        sizeCell.setAttribute("class", "badge");
        if (errorMsg === "")
            sizeCell.textContent = "No Block with more than " + minTxsToPrint + " TXs was found.";
        else
            sizeCell.textContent = errorMsg;
        txRow.insertCell(-1).appendChild(sizeCell);

        for (e = 0; e < 3; e++) {
            var emptyCell = document.createElement('span');
            emptyCell.setAttribute("class", "badge");
            emptyCell.textContent = "-";
            txRow.insertCell(-1).appendChild(emptyCell);
        }
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
        txHash.innerHTML = hash.slice(0, 4) + "..." + hash.slice(-4);
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
    nTxs = CURRENT_BLOCKS[bIndex].block.result.tx.length;
    for (i = 0; i < restoredHiddenRows.length; i++) {
        tableBlocks.rows[restoredHiddenRows[i]].hidden = !tableBlocks.rows[restoredHiddenRows[i]].hidden;
    }

    //scroll to
    tableBlocks.rows[restoredHiddenRows[restoredHiddenRows.length - 1]].scrollIntoView();
}