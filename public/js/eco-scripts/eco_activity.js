//===============================================================
//================== RESTORE TRANSACTIONS =======================
//===============================================================
//Restore Invoke tx
function restoreInvokeTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        var invokeJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
        if (invokeJsonParams.type === "invoke") {
            $("#invokehashjs").val(invokeJsonParams.contract_scripthash);
            $("#invokeparamsjs").val(JSON.stringify(invokeJsonParams.neonJSParams));
            $("#attachgasfeejs").val(invokeJsonParams.mynetfee);
            $("#attachSystemgasjs").val(invokeJsonParams.mysysgasfee);
            $("#attachneojs").val(invokeJsonParams.neo);
            $("#attachgasjs").val(invokeJsonParams.gas);
            if (searchAddrIndexFromBase58(invokeJsonParams.caller) != -1)
                $("#wallet_invokejs")[0].selectedIndex = searchAddrIndexFromBase58(invokeJsonParams.caller);

	    if(!DISABLE_ACTIVITY_HISTORY)
            	$('.nav-pills a[data-target="#network"]').tab('show');
        }
    } else {
        alert("Cannot restore invoke of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}

function restoreDeployTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        var deployJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
        console.log(deployJsonParams);
        if (deployJsonParams.type === "deploy") {
            $("#attachDeployGasFeeJS").val(deployJsonParams.mynetfee.slice(0,10));
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

	    if(!DISABLE_ACTIVITY_HISTORY)
	            $('.nav-pills a[data-target="#network"]').tab('show');
        }

    } else {
        alert("Cannot restore deploy TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
    }
}

function restoreSendTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
	var sendJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
        if (sendJsonParams.type === "send") {
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

	    if(!DISABLE_ACTIVITY_HISTORY)
	            $('.nav-pills a[data-target="#transaction"]').tab('show');
        }
    } else {
        createNotificationOrAlert("Restoring Send Problem!", "Size of requested index was not found correctly", 5000);
    }
}

function restoreClaimTX(txID) {
    if (txID < vecRelayedTXs.length && txID > -1) {
        var claimJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
        if (claimJsonParams.type === "claim") {        
            if (searchAddrIndexFromBase58(claimJsonParams.caller) != -1)
                $("#createtx_from")[0].selectedIndex = searchAddrIndexFromBase58(claimJsonParams.caller);

	    if(!DISABLE_ACTIVITY_HISTORY)
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

//===============================================================
function ImportHistoricalActivityJSON() {
    var file = document.getElementById("importActivityFile").files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            var activityHistory = this.result;
            console.log("Printing historical transactions to be loaded...")
            console.log(activityHistory);
            loadHistory(JSON.parse(activityHistory));
        };
        reader.readAsBinaryString(file);
    }
}
//===============================================================

//===============================================================
function loadHistory(vecRelayedTXsToLoad) {
    console.log(vecRelayedTXsToLoad);
    vecRelayedTXs = vecRelayedTXsToLoad;
    drawRelayedTXs();
}
//===============================================================

//===============================================================
//===============================================================
//===============================================================


//===============================================================
//================= REPLAY TOOLS ================================
//===============================================================
function openReplayToolsTXs() {
    if (vecRelayedTXs.length > 0) {
        drawRelayedTXs();
        if ($("#btnReplayTXsTools")[0].checked) {
	    $("#cbx_disableHistory")[0].checked = true;
            $("#cbx_disableAutomaticClaim")[0].checked = true;
            DISABLE_ACTIVITY_HISTORY = true;
            DISABLE_AUTOMATIC_CLAIM = true;

            if (vecRelayedTXs[0].replayHeight) {
                console.log("Loading replay with pre-defined values");
                for (txID = 0; txID < vecRelayedTXs.length; txID++) {
                    if (vecRelayedTXs[txID].replayHeight == "-") {
                        console.error("Historical replay height of tx: " + txID + " could not be loaded properly!");
			vecRelayedTXs[txID].replayHeight = Number(vecRelayedTXs[txID-1].replayHeight + 1);
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

            ORDERED_MAP_LIST_REPLAY = getOrderedReplayAndFillInfo();
        }else{
	
		$("#cbx_disableHistory")[0].checked = false;
		$("#cbx_disableAutomaticClaim")[0].checked = false;
		DISABLE_ACTIVITY_HISTORY = false;
		DISABLE_AUTOMATIC_CLAIM = false;
	}
    }else
    {
	document.getElementById("txt_replayOrder").value = '';
    }
}

function getOrderedReplayAndFillInfo() {
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
        document.getElementById("txt_replayOrder").value += JSON.stringify(entry.txs) + " - [{";
	for (var t = 0; t < entry.txs.length; t++)
	{
		document.getElementById("txt_replayOrder").value += JSON.parse(vecRelayedTXs[entry.txs[t].txID].txParams).type + "}";
		if(t < (entry.txs.length-1))
			document.getElementById("txt_replayOrder").value += ",{";	
	}
	document.getElementById("txt_replayOrder").value += "]\n";
    });

   return orderedMapList;
}


async function replayTXs() {
	console.log(ORDERED_MAP_LIST_REPLAY);
	// loop for each replay height
	var lastReplayHeight = ORDERED_MAP_LIST_REPLAY[0].height;
	var lastHeight = LAST_BEST_HEIGHT_NEOCLI;
	for (var rH = 0; rH < ORDERED_MAP_LIST_REPLAY.length; rH++) {
		// Wait until height is according
		if(rH < ORDERED_MAP_LIST_REPLAY.length)
		{
			var heightDiff = ORDERED_MAP_LIST_REPLAY[rH].height - lastReplayHeight;
			while( (LAST_BEST_HEIGHT_NEOCLI - lastHeight) <= heightDiff)
			{
				console.log("Inside automatic replay. Waiting for next desired height difference of: " + heightDiff);
				console.log("Best known height is:" + LAST_BEST_HEIGHT_NEOCLI + " and last relayed was " + lastHeight);
				await sleep(1000);
			}
		}

		var vec_txs = ORDERED_MAP_LIST_REPLAY[rH].txs;

		// Replay all TXs for this current height
		for (var t = 0; t < vec_txs.length; t++) {
			//console.log("tx index: " + vec_txs[t].txID);
			// TX params
			var tempTxParams = JSON.parse(vecRelayedTXs[vec_txs[t].txID].txParams);

			$('#activityTableBtnRestore' + vec_txs[t].txID).click(); 
			if (tempTxParams.type === "invoke")
			   $('#invokebtn').click(); 

			if (tempTxParams.type === "deploy")
			    $('#deploybtnjs').click(); 

			if (tempTxParams.type === "send")
			    createSendTxForm(); 

			if (tempTxParams.type === "claim")
			    createGasTxForm();
		}

		// Update last replay height and last persisted height for next iteration
		lastReplayHeight = ORDERED_MAP_LIST_REPLAY[rH].height;
		// we sum plus +1 because it will take one block to deploy
		lastHeight = LAST_BEST_HEIGHT_NEOCLI + 1;
	}

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
//===============================================================
//===============================================================
//===============================================================
