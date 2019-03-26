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
    var headersTxType = document.createElement('div');
    var headerstxScriptHash = document.createElement('div');
    var headerstxParams = document.createElement('div');
    var headersTXHeight = document.createElement('div');
    var headerNeoScanLink = document.createElement('div');
    headerID.innerHTML = "<b> ID </b>";
    row.insertCell(-1).appendChild(headerID);
    headersAppLog.innerHTML = "<b> Status</b>";
    row.insertCell(-1).appendChild(headersAppLog);
    headersRestore.innerHTML = "<b> Restore </b>";
    row.insertCell(-1).appendChild(headersRestore);
    headersTxType.innerHTML = "<b> Type </b>";
    row.insertCell(-1).appendChild(headersTxType);
    headerstxScriptHash.innerHTML = "<b> ScriptHash </b>";
    row.insertCell(-1).appendChild(headerstxScriptHash);
    headerstxParams.innerHTML = "<b> Params </b>";
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

        var bRestore = document.createElement('button');
        bRestore.setAttribute('content', 'test content');
        bRestore.setAttribute('class', 'btn btn-info');
        bRestore.setAttribute('value', i);
        bRestore.innerHTML = '<i class="fas fa-reply"></i>';
        if (vecRelayedTXs[i].txType === "Invoke")
            bRestore.onclick = function() {
                restoreInvokeTX(this.value);
            };
        else if (vecRelayedTXs[i].txType === "Deploy")
            bRestore.onclick = function() {
                restoreDeployTX(this.value);
            };
        else if (vecRelayedTXs[i].txType === "Send")
            bRestore.onclick = function() {
                restoreSendTX(this.value);
            };
        else if (vecRelayedTXs[i].txType === "Claim")
            bRestore.onclick = function() {
                restoreClaimTX(this.value);
            };
        else
            bRestore.onclick = function() {};
        txRow.insertCell(-1).appendChild(bRestore);

        var inputTxType = document.createElement("input");
        //input.setAttribute("type", "hidden");
        inputTxType.setAttribute("name", "textTxType" + i);
        inputTxType.setAttribute("readonly", "true");
        inputTxType.style.width = '70px';
        inputTxType.setAttribute("value", vecRelayedTXs[i].txType);
        txRow.insertCell(-1).appendChild(inputTxType);

        var inputSH = document.createElement("input");
        inputSH.setAttribute("name", "textScriptHash" + i);
        inputSH.setAttribute("readonly", "true");
        inputSH.style.width = '120px';
        inputSH.setAttribute("value", vecRelayedTXs[i].txScriptHash);
        txRow.insertCell(-1).appendChild(inputSH);

        var inputParams = document.createElement("input");
        inputParams.setAttribute("name", "textParams" + i);
        inputParams.setAttribute("readonly", "true");
        inputParams.setAttribute("value", vecRelayedTXs[i].txParams);
        txRow.insertCell(-1).appendChild(inputParams);

        var inputTxHeight = document.createElement("input");
        inputTxHeight.setAttribute("name", "textTxHeight" + i);
        inputTxHeight.setAttribute("readonly", "true");
        inputTxHeight.style.width = '60px';
        inputTxHeight.setAttribute('value', '-');
        inputTxHeight.setAttribute('id', "textTxHeight" + i);
        txRow.insertCell(-1).appendChild(inputTxHeight);

        if ($("#btnReplayTXsTools")[0].checked) {
            var inputTxReplayHeight = document.createElement("input");
            inputTxReplayHeight.setAttribute("name", "textReplayHeight" + i);
            inputTxReplayHeight.style.width = '50px';
            inputTxReplayHeight.setAttribute('value', '-');
            inputTxReplayHeight.setAttribute('oninput', 'mapReplayByHeight()');
            inputTxReplayHeight.setAttribute('id', "textReplayHeight" + i);
            txRow.insertCell(-1).appendChild(inputTxReplayHeight);
        }

        if (ENABLE_NEOSCAN_TRACKING) {
            var txIDCell = document.createElement("a");
            var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[i].tx;
            txIDCell.text = vecRelayedTXs[i].tx.slice(0, 6) + "..." + vecRelayedTXs[i].tx.slice(-6);
            txIDCell.href = urlToGet;
            txIDCell.target = '_blank';
            txIDCell.onclick = urlToGet;
            txIDCell.style.width = '70px';
            txIDCell.style.display = 'block';
            txRow.insertCell(-1).appendChild(txIDCell);
        } else {
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
        }

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
function updateVecRelayedTXsAndDraw(relayedTXID, actionType, txScriptHash, txParams) {
    vecRelayedTXs.push({
        tx: relayedTXID,
        txType: actionType,
        txScriptHash: txScriptHash,
        txParams: txParams
    });
    drawRelayedTXs();
}
//===============================================================

//===============================================================
//Call app log
function callAppLogOrRawTx(txID, rawTX = false) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        var txHash = vecRelayedTXs[txID].tx;
        var appLogJson = [];
        if ((vecRelayedTXs[txID].txType == "Deploy" || vecRelayedTXs[txID].txType == "Invoke") && !rawTX)
            appLogJson.push({
                "jsonrpc": "2.0",
                "id": 5,
                "method": "getapplicationlog",
                "params": [vecRelayedTXs[txID].tx]
            });
        else
            appLogJson.push({
                "jsonrpc": "2.0",
                "id": 5,
                "method": "getrawtransaction",
                "params": [vecRelayedTXs[txID].tx]
            });
        $("#txtRPCJson").val(JSON.stringify(appLogJson));
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
//================== RESTORE TRANSACTIONS =======================
//===============================================================
//Restore Invoke tx
function restoreInvokeTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        if (vecRelayedTXs[txID].txType === "Invoke") {
            var invokeJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
            $("#invokehashjs").val(vecRelayedTXs[txID].txScriptHash);
            $("#invokeparamsjs").val(JSON.stringify(invokeJsonParams.neonJSParams));
            $("#attachgasfeejs").val(invokeJsonParams.mynetfee);
            $("#attachSystemgasjs").val(invokeJsonParams.mysysgasfee);
            $("#attachneojs").val(invokeJsonParams.neo);
            $("#attachgasjs").val(invokeJsonParams.gas);
            if (searchAddrIndexFromBase58(invokeJsonParams.caller) != -1)
                $("#wallet_invokejs")[0].selectedIndex = searchAddrIndexFromBase58(invokeJsonParams.caller);
            $('.nav-pills a[data-target="#network"]').tab('show');
        }
    } else {
        alert("Cannot restore invoke of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}

function restoreDeployTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        if (vecRelayedTXs[txID].txType === "Deploy") {

            var deployJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
            console.log(deployJsonParams);
            $("#attachDeployGasFeeJS").val(deployJsonParams.mynetfee);
            $("#jsdeploy_name").val(deployJsonParams.contract_appname);
            $("#jsdeploy_desc").val(deployJsonParams.contract_description);
            $("#jsdeploy_email").val(deployJsonParams.contract_email);
            $("#jsdeploy_author").val(deployJsonParams.contract_author);
            $("#jsdeploy_version").val(deployJsonParams.contract_version);
            $("#contractparamsjs").val(deployJsonParams.par);
            $("#codeavm").val(deployJsonParams.contract_script);
            $("#contracthashjs").val(getScriptHashFromAVM(deployJsonParams.contract_script));
            $("#contractreturnjs")[0].value = getIndexForReturnSelectionBox(deployJsonParams.returntype);

            if (deployJsonParams.storage == 0) {
                $("#cbx_storagejs")[0].checked = false;
                $("#cbx_dynamicinvokejs")[0].checked = false;
                $("#cbx_ispayablejs")[0].checked = false;
            }
            if (deployJsonParams.storage == 1) {
                $("#cbx_storagejs")[0].checked = true;
                $("#cbx_dynamicinvokejs")[0].checked = false;
                $("#cbx_ispayablejs")[0].checked = false;
            }
            if (deployJsonParams.storage == 2) {
                $("#cbx_storagejs")[0].checked = false;
                $("#cbx_dynamicinvokejs")[0].checked = true;
                $("#cbx_ispayablejs")[0].checked = false;
            }
            if (deployJsonParams.storage == 3) {
                $("#cbx_storagejs")[0].checked = true;
                $("#cbx_dynamicinvokejs")[0].checked = true;
                $("#cbx_ispayablejs")[0].checked = false;
            }
            if (deployJsonParams.storage == 4) {
                $("#cbx_storagejs")[0].checked = false;
                $("#cbx_dynamicinvokejs")[0].checked = false;
                $("#cbx_ispayablejs")[0].checked = true;
            }
            if (deployJsonParams.storage == 5) {
                $("#cbx_storagejs")[0].checked = true;
                $("#cbx_dynamicinvokejs")[0].checked = false;
                $("#cbx_ispayablejs")[0].checked = true;
            }
            if (deployJsonParams.storage == 6) {
                $("#cbx_storagejs")[0].checked = false;
                $("#cbx_dynamicinvokejs")[0].checked = true;
                $("#cbx_ispayablejs")[0].checked = true;
            }
            if (deployJsonParams.storage == 7) {
                $("#cbx_storagejs")[0].checked = true;
                $("#cbx_dynamicinvokejs")[0].checked = true;
                $("#cbx_ispayablejs")[0].checked = true;
            }


            if (searchAddrIndexFromBase58(deployJsonParams.caller) != -1)
                $("#wallet_deployjs")[0].selectedIndex = searchAddrIndexFromBase58(deployJsonParams.caller);

            $('.nav-pills a[data-target="#network"]').tab('show');
        }

    } else {
        alert("Cannot restore deploy TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}

function restoreSendTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        if (vecRelayedTXs[txID].txType === "Send") {
            var sendJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);

            if (searchAddrIndexFromBase58(sendJsonParams.caller) == -1) {
                createNotificationOrAlert("Restoring Send Problem!", "Account" + sendJsonParams.caller + "not found", 5000);
                return;
            }

            $("#createtx_from")[0].selectedIndex = searchAddrIndexFromBase58(sendJsonParams.caller);

            if (searchAddrIndexFromBase58(sendJsonParams.to) == -1) {
                createNotificationOrAlert("Restoring Send Problem!", "Account" + sendJsonParams.to + "not found", 5000);
                return;
            }

            $("#createtx_to")[0].selectedIndex = searchAddrIndexFromBase58(sendJsonParams.to)
            $("#createtx_NEO").val(sendJsonParams.neo);
            $("#createtx_GAS").val(sendJsonParams.gas);

            /*
            if(sendJsonParams.sendingFromSCFlag);
               $("#cbx_storagejs")[0].checked = true;
            else
              $("#cbx_storagejs")[0].checked = false;*/

            $('.nav-pills a[data-target="#transaction"]').tab('show');
        }
    } else {
        createNotificationOrAlert("Restoring Send Problem!", "Size of requested index was not found correctly", 5000);
    }
}

function restoreClaimTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        if (vecRelayedTXs[txID].txType === "Claim") {
            var claimJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);

            if (searchAddrIndexFromBase58(claimJsonParams.caller) != -1)
                $("#createtx_from")[0].selectedIndex = searchAddrIndexFromBase58(claimJsonParams.caller);

            $('.nav-pills a[data-target="#transaction"]').tab('show');
        }
    } else {
        alert("Cannot restore claim of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}
//===============================================================
//================== RESTORE TRANSACTIONS =======================
//===============================================================

//===============================================================
function exportHistory() {
    var tempVecRelayedTXs = vecRelayedTXs;
    for (var t = 0; t < tempVecRelayedTXs.length; t++)
        tempVecRelayedTXs[t]["height"] = document.getElementById("textTxHeight" + t).value;

    if ($("#btnReplayTXsTools")[0].checked)
        for (var t = 0; t < tempVecRelayedTXs.length; t++)
            tempVecRelayedTXs[t]["replayHeight"] = document.getElementById("textReplayHeight" + t).value;

    mydataStringfied = JSON.stringify(tempVecRelayedTXs);
    console.log(mydataStringfied);


    var file = new Blob();
    file = new Blob([mydataStringfied], {
        type: 'text/plain'
    }); //new Blob([data], {type: type});
    download(file, ".json");
}

function loadHistory(vecRelayedTXsToLoad) {
    vecRelayedTXs = vecRelayedTXsToLoad;
    drawRelayedTXs();
}


//===============================================================

//================= REPLAY TOOLS ================================
//===============================================================
function openReplayToolsTXs() {
    console.log("openReplayToolsTxs");
    if (vecRelayedTXs.length > 0) {
        drawRelayedTXs();

        if ($("#btnReplayTXsTools")[0].checked) {
            if (vecRelayedTXs[0].replayHeight) {
                console.log("Loading replay with pre-defined values");
                for (txID = 0; txID < vecRelayedTXs.length; txID++) {
                    if (!vecRelayedTXs[txID].replayHeight) {
                        console.error("Historical replay height of tx: " + txID + " could not be loaded properly!");
                        return;
                    }
                    document.getElementById("textReplayHeight" + txID).value = Number(vecRelayedTXs[txID].replayHeight);
                }
            } else {
                //First txs is set to 0	    
                if (!vecRelayedTXs[0].height) {
                    console.error("Historical height of tx: " + 0 + " could not be loaded properly!");
                    return;
                }
                document.getElementById("textReplayHeight" + 0).value = 0;

                for (txID = 1; txID < vecRelayedTXs.length; txID++) {
                    if (!vecRelayedTXs[txID].height) {
                        console.error("Historical height of tx: " + txID + " could not be loaded properly!");
                        return;
                    }
                    var histHeight = Number(vecRelayedTXs[txID].height);
                    var lastIndex = txID - 1;
                    var histHeightLastIndex = Number(vecRelayedTXs[lastIndex].height);
                    var lastRelayHeight = Number(document.getElementById("textReplayHeight" + lastIndex).value);
                    if (histHeight != -100 && histHeightLastIndex != -100)
                        document.getElementById("textReplayHeight" + txID).value = Number(lastRelayHeight + (histHeight - histHeightLastIndex));
                    else
                        document.getElementById("textReplayHeight" + txID).value = Number(lastRelayHeight + 1);
                }
            }

            getOrderedReplayAndFillInfo();
        }
    }
}

function getOrderedReplayAndFillInfo() {
    console.log("mapReplayByHeight");
    var mapReplayPerHeight = new Map();
    for (var t = 0; t < vecRelayedTXs.length; t++) {
        var height = Number(document.getElementById("textReplayHeight" + t).value);
        var txsPerHeight = [];
        if (mapReplayPerHeight.has(height))
            txsPerHeight = mapReplayPerHeight.get(height);
        txsPerHeight.push({
            txID: t
        });
        mapReplayPerHeight.set(height, txsPerHeight);
    }

    //============================================
    //Transforming map to list and ordering
    var orderedMapList = [];
    mapReplayPerHeight.forEach(function(value, key) {
        orderedMapList.push({
            height: key,
            txs: value
        });
    }, mapReplayPerHeight);
    orderedMapList.sort(function(a, b) {
        return a.height - b.height
    });
    //============================================

    //const mapReplayPerHeightSorted = new Map([...mapReplayPerHeight.entries()].sort(function(a,b){return Number(a) - Number(b);}));
    $("#txt_replayOrder").val("");
    //mapReplayPerHeightSorted.forEach(printMap);
    orderedMapList.forEach(function(entry) {
        document.getElementById("txt_replayOrder").value += "Reference Height: " + entry.height + " - ";
        document.getElementById("txt_replayOrder").value += JSON.stringify(entry.txs) + "\n";
    });

   return orderedMapList;
}

/*
function printMap(values, key) {
    document.getElementById("txt_replayOrder").value += "Reference Height: " + key + " - ";
    document.getElementById("txt_replayOrder").value += JSON.stringify(values) + "\n";
}*/
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
    //console.log(vecRelayedTXs[indexToUpdate].txType)
    var jsonDataToCallNeoCli = [];
    if (vecRelayedTXs[indexToUpdate].txType == "Deploy" || vecRelayedTXs[indexToUpdate].txType == "Invoke")
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
                if (vecRelayedTXs[indexToUpdate].txType == "Deploy" || vecRelayedTXs[indexToUpdate].txType == "Invoke")
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
