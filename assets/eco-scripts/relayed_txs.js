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
    headersAppLog.innerHTML = "<b><center><font size='1'>APP. LOG</font></b>";
    headerRow.insertCell(-1).appendChild(headersAppLog);
    headersRawTx.innerHTML = "<b><center><font size='1'>RAW TX.</font></b>";
    headerRow.insertCell(-1).appendChild(headersRawTx);
    headersRestore.innerHTML = "<b><center><font size='1'>RESTORE</font></b>";
    headerRow.insertCell(-1).appendChild(headersRestore);

    table.appendChild(headerRow);

    for (rt = 0; rt < RELAYED_TXS.length; rt++) {
        var txRow = table.insertRow(-1);
        //row.insertCell(-1).appendChild(document.createTextNode(i));
        //Insert button that remove rule
        var b = document.createElement('button');
        b.setAttribute('content', 'test content');
        b.setAttribute('class', 'btn btn-danger btn-sm');
        b.setAttribute('value', ka);
        b.onclick = function() {
            removeRelayedTX(this.value);
        };
        var resultOrError = "";
        var txErrored = false;
        if (typeof(RELAYED_TXS[rt][1].result) != "undefined") {
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
            txAppLog.onclick = function() {
                callTXAppLog(this.value);
            };
            txAppLog.innerHTML = "AppLog";
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
            txRaw.onclick = function() {
                callRawTx(this.value);
            };
            txRaw.innerHTML = "RawTx";
        } else {
            txRaw.innerHTML = "-";
        }
        txRow.insertCell(-1).appendChild(txRaw);

        var txRestore = document.createElement('button');
        txRestore.setAttribute('content', 'test content');
        txRestore.setAttribute('class', 'btn btn-success btn-sm');
        txRestore.setAttribute('value', rt);
        txRestore.setAttribute('id', "btnRestoreTx" + rt);
        txRestore.onclick = function() {
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