//===============================================================
//====================UPDATES THE HOLE ACTIVITY TABLE ===========
function drawRelayedTXs() {
    var table = document.createElement("table");
    table.setAttribute('class', 'table');
    table.style.width = '20px';
    var row = table.insertRow(-1);

    var headerID = document.createElement('div');
    var headersAppLog = document.createElement('div');
    var headersRestore = document.createElement('div');
    var headerstxParams = document.createElement('div');
    var headersTXHeight = document.createElement('div');
    var headerNeoScanLink = document.createElement('div');
    headerID.innerHTML = "<b> ID </b>";
    row.insertCell(-1).appendChild(headerID);
    headersAppLog.innerHTML = "<b> Status</b>";
    row.insertCell(-1).appendChild(headersAppLog);
    headersRestore.innerHTML = "<b> Restore </b>";
    row.insertCell(-1).appendChild(headersRestore);
    headerstxParams.innerHTML = "<b> Transaction parameters </b>";
    row.insertCell(-1).appendChild(headerstxParams);
    headersTXHeight.innerHTML = "<b> Height </b>";
    row.insertCell(-1).appendChild(headersTXHeight);

    if ($("#btnReplayTXsTools")[0].checked) {
        var headerReplayingTXs = document.createElement('div');
        headerReplayingTXs.innerHTML = "<b> ReplayHeight </b>";
        row.insertCell(-1).appendChild(headerReplayingTXs);
    }

    headerNeoScanLink.innerHTML = "<b> Hash </b>";
    row.insertCell(-1).appendChild(headerNeoScanLink);

    for (i = 0; i < vecRelayedTXs.length; i++) {
        var txRow = table.insertRow(-1);
        //row.insertCell(-1).appendChild(document.createTextNode(i));
        var b = document.createElement('button');
        b.setAttribute('content', 'test content');
        b.setAttribute('class', 'btn btn-danger');
        b.setAttribute('value', i);
        b.onclick = function() {
            buttonRemoveTX(this.value);
        };
        b.innerHTML = i;
        txRow.insertCell(-1).appendChild(b);

        var bGoToAppLog = document.createElement('button');
        bGoToAppLog.setAttribute('content', 'test content');
        bGoToAppLog.setAttribute('class', 'btn btn-info');
        bGoToAppLog.setAttribute('value', i);
        bGoToAppLog.setAttribute('id', "appLogNeoCli" + i);
        bGoToAppLog.onclick = function() {
            callAppLogOrRawTx(this.value);
        };
        bGoToAppLog.innerHTML = '?';
        txRow.insertCell(-1).appendChild(bGoToAppLog);

	// TX params
        var tempTxParams = JSON.parse(vecRelayedTXs[i].txParams);

        var bRestore = document.createElement('button');
        bRestore.setAttribute('content', 'test content');
        bRestore.setAttribute('class', 'btn btn-info');
        bRestore.setAttribute('value', i);
        bRestore.setAttribute('id', "activityTableBtnRestore" + i);
        bRestore.innerHTML = '<i class="fas fa-reply"></i>';
        if (tempTxParams.type === "invoke")
            bRestore.onclick = function() {
                restoreInvokeTX(this.value);
            };
        else if (tempTxParams.type === "deploy")
            bRestore.onclick = function() {
                restoreDeployTX(this.value);
            };
        else if (tempTxParams.type === "send")
            bRestore.onclick = function() {
                restoreSendTX(this.value);
            };
        else if (tempTxParams.type === "claim")
            bRestore.onclick = function() {
                restoreClaimTX(this.value);
            };
        else
            bRestore.onclick = function() {};
        txRow.insertCell(-1).appendChild(bRestore);

        var inputParams = document.createElement("span");
        inputParams.setAttribute("name", "textParams" + i);
        inputParams.setAttribute("class", "col-md-12");
        inputParams.setAttribute("readonly", "true");
	if(tempTxParams.contract_script)
		tempTxParams.contract_script = tempTxParams.contract_script.slice(0, 26) + "..." + tempTxParams.contract_script.slice(-26);
        inputParams.innerHTML = JSON.stringify(tempTxParams, undefined, 2);
        txRow.insertCell(-1).appendChild(inputParams);

        var inputTxHeight = document.createElement("input");
        inputTxHeight.setAttribute("name", "textTxHeight" + i);
        inputTxHeight.setAttribute("readonly", "true");
        inputTxHeight.style.width = '60px';
        inputTxHeight.setAttribute('value', '-');
        inputTxHeight.setAttribute('id', "textTxHeight" + i);
        txRow.insertCell(-1).appendChild(inputTxHeight);

        if ($("#btnReplayTXsTools")[0].checked) {
	    var lastValue = '-';
	    if(document.getElementById("textReplayHeight" + i))
            	lastValue = document.getElementById("textReplayHeight" + i).value
            var inputTxReplayHeight = document.createElement("input");
            inputTxReplayHeight.setAttribute("name", "textReplayHeight" + i);
            inputTxReplayHeight.style.width = '50px';
            inputTxReplayHeight.setAttribute('value', lastValue);
            inputTxReplayHeight.setAttribute('oninput', 'getOrderedReplayAndFillInfo()');
            inputTxReplayHeight.setAttribute('id', "textReplayHeight" + i);
            txRow.insertCell(-1).appendChild(inputTxReplayHeight);
        }

            var txIDCell = document.createElement('button');
            txIDCell.setAttribute('content', 'test content');
            txIDCell.setAttribute('class', 'btn btn-info');
            txIDCell.setAttribute('value', i);
            txIDCell.setAttribute('id', "btnGetTransactionRaw" + i);
            txIDCell.onclick = function() {
                callAppLogOrRawTx(this.value, true);
            };
            txIDCell.innerHTML = vecRelayedTXs[i].tx.slice(0, 6) + "..." + vecRelayedTXs[i].tx.slice(-6);
            txRow.insertCell(-1).appendChild(txIDCell);

        //Check activation status ends	
    } //Finishes loop that draws each relayed transaction

    //Clear previous data
    document.getElementById("divRelayedTXs").innerHTML = "";
    //fill table
    document.getElementById("divRelayedTXs").appendChild(table);

    //call function for updating fields that requires POST/GET calls
    searchForTXs();
} //Finishes DrawRules function
//===============================================================

//===============================================================
//Update vector of relayed txs
function updateVecRelayedTXsAndDraw(relayedTXID, txParams) {
    vecRelayedTXs.push({
        tx: relayedTXID,
        txParams: txParams,
	height: -100
    });
    drawRelayedTXs();
}
//===============================================================

//===============================================================
//Call app log
function callAppLogOrRawTx(txID, rawTX = false) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        var tempTxParams = JSON.parse(vecRelayedTXs[txID].txParams);
        var txHash = vecRelayedTXs[txID].tx;
        var appLogJson = [];
        if ((tempTxParams.type == "deploy" || tempTxParams.type == "invoke") && !rawTX)
        { 
            appLogJson.push({
                "jsonrpc": "2.0",
                "id": 5,
                "method": "getapplicationlog",
                "params": [vecRelayedTXs[txID].tx]
            });
            $("#txtRPCJson").val(JSON.stringify(appLogJson));
	}
        else
            $("#txtRPCJson").val('{ "jsonrpc": "2.0", "id": 5, "method": "getrawtransaction", "params": ["'+vecRelayedTXs[txID].tx+'","true"]}');

        $('#btnCallJsonRPC').click();
        //$("#pillstab").children().eq(1).find('a').tab('show');
        //$('.nav-pills li:eq(3) a').tab('show');
        //document.getElementById('divFormJsonOut').scrollIntoView();
        $('.nav-pills a[data-target="#rawRPC"]').tab('show');
    } else {
        alert("Cannot get log of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}
//===============================================================

//===============================================================
//This function tries to search and verify for all relayed TXs that were, possible, broadcasted and included in the blockchain
function searchForTXs() {
    //console.log("Searching tx's");
    for (i = 0; i < vecRelayedTXs.length; i++)
        searchForTX(i);
}
//This function tries to search and verify for a specific relayed TX that was, possible, broadcasted and included in the blockchain
function searchForTX(indexToUpdate) {

    //DEPRECATED QUERY FOR CHECKING IF FOUND ON NEOSCAN AND LINK TO Logs from csharp docker container
    /*
      $.getJSON(BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[indexToUpdate].tx, function(result) {
          //console.log("div is activationStatus"+indexToUpdate);
          if(result.txid == "not found" || result.vin == null){
            document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"blue\">PENDING</font>";
          }else{
            document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"green\">FOUND</font><a target='_blank' href='txnotifications?txid="+vecRelayedTXs[indexToUpdate].tx+"'>(logs)</a>";
          }
      }).fail(function (result) {
          document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"red\">FAILED</font>";
      });
*/
    var jsonDataToCallNeoCli = [];
    var tempTxParams = JSON.parse(vecRelayedTXs[indexToUpdate].txParams);
    if (tempTxParams.type == "deploy" || tempTxParams.type == "invoke")
        jsonDataToCallNeoCli.push({
            "jsonrpc": "2.0",
            "id": 5,
            "method": "getapplicationlog",
            "params": [vecRelayedTXs[indexToUpdate].tx]
        });
    else
        jsonDataToCallNeoCli.push({
            "jsonrpc": "2.0",
            "id": 5,
            "method": "getrawtransaction",
            "params": [vecRelayedTXs[indexToUpdate].tx]
        });

    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        JSON.stringify(jsonDataToCallNeoCli), // Serializes form data in standard format
        function(data) {
            //console.log(data);
            if (data[0].result) {
                if (tempTxParams.type == "deploy" || tempTxParams.type == "invoke")
                    document.getElementById("appLogNeoCli" + indexToUpdate).innerHTML = data[0].result.executions[0].vmstate;
                else
                    document.getElementById("appLogNeoCli" + indexToUpdate).innerHTML = '<i class="fas fa-thumbs-up"></i>';
                //if(data[0].result.vmstate) // 2.X
                //     	document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].result.vmstate;
                //else
                //	document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].result.executions[0].vmstate;
            } else {
                document.getElementById("appLogNeoCli" + indexToUpdate).innerHTML = data[0].error.code;
            }
        },
        "json" // The format the response should be in
    ).fail(function() {
        document.getElementById("appLogNeoCli" + indexToUpdate).innerHTML = "FAILED";
    }); //End of POST for search

    //===========================================================
    // Get Transaction HEIGHT
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        JSON.stringify({
            "jsonrpc": "2.0",
            "id": 5,
            "method": "gettransactionheight",
            "params": [vecRelayedTXs[indexToUpdate].tx]
        }), // Serializes form data in standard format
        function(data) {
            //console.log("Inside get transaction height")
            //console.log(data);
            if (data.result) {
                document.getElementById("textTxHeight" + indexToUpdate).value = data.result;
            } else {
                document.getElementById("textTxHeight" + indexToUpdate).value = data.error.code;
            }
        },
        "json" // The format the response should be in
    ).fail(function() {
        document.getElementById("textTxHeight" + indexToUpdate).value = "FAILED";
    }); //End of POST for search
    //===========================================================
}
//===============================================================

//===============================================================
function buttonRemoveTX(idToRemove) {
    if (idToRemove < vecRelayedTXs.length && idToRemove > -1) {
        vecRelayedTXs.splice(idToRemove, 1);
        drawRelayedTXs();
    } else {
        alert("Cannot remove TX with ID " + idToRemove + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}
//===============================================================
