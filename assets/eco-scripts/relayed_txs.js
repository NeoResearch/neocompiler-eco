//===============================================================
function drawRelayedTXs() {
    var table = document.createElement("tbody");
    //table.setAttribute('class', 'table');
    //table.style.width = '20px';

    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headersHash = document.createElement('td');
    var headersContract = document.createElement('td');
    var headersMethod = document.createElement('td');
    var headersAppLog = document.createElement('td');
    var headersRawTx = document.createElement('td');
    var headersRestore = document.createElement('td');

    headersHash.innerHTML = "<b><center><font size='1'>HASH</font></b>";
    headerRow.insertCell(-1).appendChild(headersHash);
    headersContract.innerHTML = "<b><center><font size='1'>CONTRACT</font></b>";
    headerRow.insertCell(-1).appendChild(headersContract);
    headersMethod.innerHTML = "<b><center><font size='1'>METHOD</font></b>";
    headerRow.insertCell(-1).appendChild(headersMethod);
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

        // Getting invoked function as JSON
        var invokedFunction = JSON.parse(RELAYED_TXS[rt][0].invokeFunction);

        // ============== Contract
        var txCalledContract = document.createElement('span');
        txCalledContract.setAttribute('class', 'badge');
        txCalledContract.setAttribute('id', "spanCalledContractTx" + rt);
        if (!txErrored) {
            var contractHash = invokedFunction.params[0];

            //Check if loaded
            if (NATIVE_CONTRACTS.length != 0) {
                var contract = tryToGetNotificationFromContract(contractHash);
                var contractName = "Not Found";
                if (contract != -1)
                    contractName = contract.manifest.name;

                txCalledContract.innerHTML = contractName;
                if (contractName === "Not Found")
                    txCalledContract.innerHTML = "Refresh. Still Querying...";
            } else {
                txCalledContract.innerHTML = "Refresh. Still Loading...";
            }
        } else {
            txCalledContract.innerHTML = "-";
        }
        txRow.insertCell(-1).appendChild(txCalledContract);
        // ============== Contract

        // ============== Contract
        var txCalledMethod = document.createElement('span');
        txCalledMethod.setAttribute('class', 'badge');
        txCalledMethod.setAttribute('id', "spanCalledMethod" + rt);
        if (!txErrored) {
            txCalledMethod.innerHTML = invokedFunction.params[1].toUpperCase() + " - " + invokedFunction.params[2].length + " PARAMS";
        } else {
            txCalledMethod.innerHTML = "-";
        }
        txRow.insertCell(-1).appendChild(txCalledMethod);
        // ============== Contract

        var txAppLog = document.createElement('button');
        txAppLog.setAttribute('content', 'test content');
        txAppLog.setAttribute('class', 'btn btn-success btn-sm');
        txAppLog.setAttribute('value', rt);
        txAppLog.setAttribute('id', "btnGetAppLogTx" + rt);
        if (!txErrored) {
            txAppLog.onclick = function () {
                callTXAppLog(this.value);
            };
            txAppLog.innerHTML = '<i class="fas fa-book"></i>';
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
            txRaw.innerHTML = '<i class="fas fa-receipt"></i>';
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
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-success"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Deleting tx " + idToRemove + " hash: " + RELAYED_TXS[0][1].result.hash.slice(0, 4) + "..." + + RELAYED_TXS[0][1].result.hash.slice(-4),
        text: "This TX will be deleted from your activity!",
        icon: "info",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        color: "#00AF92",
        background: "#263A40",
    }).then((result) => {
        if (result.isConfirmed) {
            if (idToRemove < RELAYED_TXS.length && idToRemove > -1) {
                RELAYED_TXS.splice(idToRemove, 1);
                drawRelayedTXs();
            } else {
                var sText = "Cannot remove TX with ID " + idToRemove + " from set of relayed transactions with size " + RELAYED_TXS.length;
                swal2Simple("Removing tx problems", sText, 5500, "error");
            }
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
