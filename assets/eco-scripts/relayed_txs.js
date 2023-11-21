//===============================================================
function drawRelayedTXs() {
    var table = document.createElement("tbody");
    //table.setAttribute('class', 'table');
    //table.style.width = '20px';

    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headersStatus = document.createElement('td');
    var headersAppLog = document.createElement('td');
    var headersRawTx = document.createElement('td');
    var headersRestore = document.createElement('td');

    headersStatus.innerHTML = "<b><center><font size='1'>STATUS</font></b>";
    headerRow.insertCell(-1).appendChild(headersStatus);
    headersAppLog.innerHTML = "<b><center><font size='1'>APP. LOG.</font></b>";
    headerRow.insertCell(-1).appendChild(headersAppLog);
    headersRawTx.innerHTML = "<b><center><font size='1'>RAW TX.</font></b>";
    headerRow.insertCell(-1).appendChild(headersRawTx);
    headersRestore.innerHTML = "<b><center><font size='1'>RESTORE</font></b>";
    headerRow.insertCell(-1).appendChild(headersRestore);

    table.appendChild(headerRow);

    for (rt = 0; rt < RELAYED_TXS.length; rt++) {
        var txRow = table.insertRow(-1);

        var b = document.createElement('button');
        b.setAttribute('content', 'test content');
        b.setAttribute('class', 'btn btn-danger btn-sm');
        b.setAttribute('value', rt);
        b.onclick = function () {
            removeRelayedTX(this.value);
        };
        var resultOrError = "";
        var txErrored = false;

        if (typeof (RELAYED_TXS[rt][1].result) != "undefined") {
            var txHash = RELAYED_TXS[rt][1].result.hash;
            resultOrError = txHash.slice(0, 4) + "..." + txHash.slice(-4);
        } else {
            txErrored = true;
            resultOrError = RELAYED_TXS[rt][1].error.message;
        }
        b.innerHTML = resultOrError;
        txRow.insertCell(-1).appendChild(b);

        var txAppLog = document.createElement('button');
        txAppLog.setAttribute('content', 'test content');
        txAppLog.setAttribute('class', 'btn btn-success btn-sm');
        txAppLog.setAttribute('value', rt);
        txAppLog.setAttribute('id', "btnGetAppLogTx" + rt);
        if (!txErrored) {
            txAppLog.onclick = function () {
                callTXAppLog(this.value);
            };
            txAppLog.innerHTML = "Get Log";
        } else {
            txAppLog.innerHTML = "-";
        }
        txRow.insertCell(-1).appendChild(txAppLog);

        var txRaw = document.createElement('button');
        txRaw.setAttribute('content', 'test content');
        txRaw.setAttribute('class', 'btn btn-success btn-sm');
        txRaw.setAttribute('value', rt);
        txRaw.setAttribute('id', "btnGetRawTx" + rt);
        if (!txErrored) {
            txRaw.onclick = function () {
                callRawTx(this.value);
            };
            txRaw.innerHTML = "Get Tx";
        } else {
            txRaw.innerHTML = "-";
        }
        txRow.insertCell(-1).appendChild(txRaw);


        /*
        var infoRaw = "RawTx";
        var infoAppLog = "AppLog";
        var funcCallRaw = "callRawTx(this.value)"
        var funcCallAppLog = "callTXAppLog(this.value)";
        if (txErrored) {
            infoRaw = "-";
            infoAppLog = "-";
            funcCallRaw = "";
            funcCallAppLog = "";
        }
        var divTemp = document.createElement('div');
        divTemp.innerHTML = '<div><button content="test content" class="btn btn-success btn-sm" onclick=' + funcCallAppLog +
            ' value="' +
            rt + '" id="btnGetAppLogTx0">' + infoAppLog +
            '</button> <button content="test content" class="btn btn-success btn-sm" value="' +
            rt + '"  onclick=' + funcCallRaw +
            '  id="btnGetRawTx0">' +
            infoRaw + '</button></div>'
        txRow.insertCell(-1).appendChild(divTemp);
        */

        var txRestore = document.createElement('button');
        txRestore.setAttribute('content', 'test content');
        txRestore.setAttribute('class', 'btn btn-success btn-sm');
        txRestore.setAttribute('value', rt);
        txRestore.setAttribute('id', "btnRestoreTx" + rt);
        txRestore.onclick = function () {
            restoreTX(this.value);
        };
        txRestore.innerHTML = '<i class="fas fa-trash-restore-alt"></i>';
        txRow.insertCell(-1).appendChild(txRestore);
    } //Finishes loop that draws each relayed transaction

    //Clear previous data
    document.getElementById("tableRelayedTxs").innerHTML = "";
    //Append new table
    document.getElementById("tableRelayedTxs").appendChild(table);
} //Finishes Draw Relayed TXs
//===============================================================

function callTXAppLog(relayedTxID) {
    var relayedTxHash = RELAYED_TXS[relayedTxID][1].result.hash;
    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getapplicationlog",
        "params": [relayedTxHash]
    };

    goToTabAndInvokeRPC(jsonForInvokingFunction)
}

function goToTabAndInvokeRPC(jsonForInvokingFunction) {
    goToTabAndClick("nav-rpc");
    var jsonToCallStringified = JSON.stringify(jsonForInvokingFunction);
    $("#txtRPCJson").val(jsonToCallStringified);
    rawRpcCall(false);
}

function callRawTx(relayedTxID) {
    var relayedTxHash = RELAYED_TXS[relayedTxID][1].result.hash;
    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getrawtransaction",
        "params": [relayedTxHash, true]
    };

    goToTabAndClick("nav-rpc");
    var jsonToCallStringified = JSON.stringify(jsonForInvokingFunction);
    $("#txtRPCJson").val(jsonToCallStringified);
    rawRpcCall(false);
}

//===============================================================
function removeRelayedTX(idToRemove) {
    swal({
        title: "Delete tx " + idToRemove + " hash: " + RELAYED_TXS[0][1].result.hash,
        text: "Tx will be delated for Historical Relayed list.",
        icon: "info",
        buttons: ["Cancel", "Proceed",],
    }).then((willTransfer) => {
        if (willTransfer) {
            if (idToRemove < RELAYED_TXS.length && idToRemove > -1) {
                RELAYED_TXS.splice(idToRemove, 1);
                drawRelayedTXs();
            } else {
                swal("Cannot remove TX with ID " + idToRemove + " from set of relayed transactions with size " + RELAYED_TXS.length, {
                    icon: "error",
                    buttons: false,
                    timer: 5500,
                });
            }
        } else {
            //swal("Ok! Cancelled.");
        }
    });
}
//===============================================================

//===============================================================
function restoreTX(idToRestore) {
    console.log(idToRestore)
    var txToRestore = RELAYED_TXS[idToRestore];
    console.log(txToRestore);

    document.getElementById("tableSigners").appendChild(txToRestore[0].signers);
    $("#sys_fee")[0].value = txToRestore[0].sysfee;
    $("#net_fee")[0].value = txToRestore[0].netfee;
    $("#valid_until")[0].value = txToRestore[0].validUntil;
    $("#tx_script")[0].value = txToRestore[0].script;
    $("#txtRPCJson")[0].value = txToRestore[0].invokeFunction;
    $("#txtRPCJsonOut")[0].value = txToRestore[0].invokeFunctionOut;

    goToTabAndClick("nav-rpc");

    if (checkIfWalletIsConnected())
        enableSignRelayAndBlink();
}
//===============================================================
