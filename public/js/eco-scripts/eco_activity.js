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
            $("#contractreturnjs")[0].value = getHexForType(deployJsonParams.returntype);

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
//===============================================================
//===============================================================

//===============================================================
//================== EXPORT ACTIVITY ============================
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
//===============================================================
//===============================================================


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
//===============================================================
