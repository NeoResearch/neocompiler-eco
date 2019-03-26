function automaticClaim(amountClaimable, idToAutomaticClaim) {
    //console.log("amountClaimable is " +  amountClaimable + " of index "+ idToAutomaticClaim);

    if (idToAutomaticClaim != -1) {
        if (ECO_WALLET[idToAutomaticClaim].account.isMultiSig) {
            jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToAutomaticClaim);
            //Multi-sig address
            createClaimMSGasTX(idToAutomaticClaim, jsonArrayWithPrivKeys, getCurrentNetworkNickname());
        } else //not multisig- normal address
        {
            createClaimGasTX(idToAutomaticClaim, BASE_PATH_CLI, getCurrentNetworkNickname());
        }
    }
}

function callClaimableFromNeoCli(adddressToGet, boxToFill = "") {
    var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getclaimable\", \"params\": [\"" + adddressToGet + "\"] }";
    //console.log("getclaimable request to: "+BASE_PATH_CLI);
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultClaimable) {
            //console.log("resultClaimable")
            //console.log(resultClaimable);
            var amountClaimable = 0;
            if (resultClaimable.result)
                amountClaimable = resultClaimable.result.unclaimed;

            if (resultClaimable.result.address && amountClaimable > 0) {
                var resultQueryAddress = resultClaimable.result.address;
                idToAutomaticClaim = searchAddrIndexFromBase58(resultQueryAddress);
                //console.log("Current gas inside claimable query is " + $("#walletGas" + idToAutomaticClaim).val() );
                if ($("#walletGas" + idToAutomaticClaim).val() == map[resultQueryAddress])
                    automaticClaim(amountClaimable, idToAutomaticClaim);
                map[resultQueryAddress] = $("#walletGas" + idToAutomaticClaim).val();
                //console.log(map);
            }

            if (boxToFill != "")
                $(boxToFill).val(amountClaimable);
            return amountClaimable;
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.error("callClaimableFromNeoCli problem. failed to pass request to RPC network!");
    }); //End of POST for search
}

function callUnclaimedFromNeoCli(adddressToGet, boxToFill = "") {
    var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getunclaimed\", \"params\": [\"" + adddressToGet + "\"] }";
    //console.log("getclaimable request to: "+BASE_PATH_CLI);
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultUnclaimed) {
            //console.log("resultUnclaimed")
            //console.log(resultUnclaimed);
            var amountUnclaimable = 0;
            if (resultUnclaimed.result)
                amountUnclaimable = resultUnclaimed.result.unavailable;

            if (boxToFill != "")
                $(boxToFill).val(amountUnclaimable);

            return amountUnclaimable;
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.error("callUnclaimedFromNeoCli problem. failed to pass request to RPC network!");
    }); //End of POST for search
}

//GAS: 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7
//NEO: 0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b
function getAllNeoOrGasFromNeoCli(adddressToGet, assetToGet, boxToFill = "", automaticTransfer = false, to = "") {
    var assetToGetHash = 0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b;
    if (assetToGet == "GAS")
        assetToGetHash = 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7;

    //console.log("formating as json for RPC request...");
    requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getaccountstate\", \"params\": [\"" + adddressToGet + "\"] }";
    //console.log(requestJson);

    //console.log("getaccountstate request to: "+BASE_PATH_CLI);
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultJsonData) {
            if (boxToFill != "")
                $(boxToFill).val(0);


            if (resultJsonData.result) {
                for (i = 0; i < resultJsonData.result.balances.length; ++i) {
                    if (resultJsonData.result.balances[i].asset == assetToGetHash) {
                        var availableAmount = resultJsonData.result.balances[i].value;
                        //console.log(assetToGet + " balance is:" + result.balance[i].amount);
                        if (boxToFill != "")
                            $(boxToFill).val(availableAmount);
                        if (automaticTransfer) {
                            if (to === "")
                                to = adddressToGet;

                            var idToTransfer = searchAddrIndexFromBase58(adddressToGet);
                            //console.log("idToTransfer:" + idToTransfer);
                            if (idToTransfer != -1 && availableAmount != 0) {
                                if (ECO_WALLET[idToTransfer].account.isMultiSig) {
                                    //Multi-sig address
                                    neoToSend = 0;
                                    gasToSend = 0;
                                    if (assetToGet == "NEO")
                                        neoToSend = availableAmount;
                                    else
                                        gasToSend = availableAmount;
                                    createTxFromMSAccount(idToTransfer, to, neoToSend, gasToSend, getCurrentNetworkNickname());
                                } else {
                                    createTxFromAccount(idToTransfer, to, availableAmount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
                                }
                            }


                        }
                    }
                }
            }
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.error("getAllNeoOrGasFromNeoCli problem. failed to pass request to RPC network!");
        //createNotificationOrAlert("getAllNeoOrGasFromNeoCli problem", "failed to pass request to RPC network!", 3000);
    }); //End of POST for search
}

function fillAllNeo() {
    var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
    getAllNeoOrGasFromNeoCli(ECO_WALLET[addrFromIndex].account.address, "NEO", "#createtx_NEO");
}

function fillAllGas() {
    var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
    getAllNeoOrGasFromNeoCli(ECO_WALLET[addrFromIndex].account.address, "GAS", "#createtx_GAS");
}

function populateAllWalletData() {
    drawWalletsStatus();

    for (ka = 0; ka < ECO_WALLET.length; ++ka)
        if (ECO_WALLET[ka].print == true && !isEncryptedOnly(ka)) {
            addressToGet = ECO_WALLET[ka].account.address;
            //walletIndex = searchAddrIndexFromBase58(addressToGet);
            getAllNeoOrGasFromNeoCli(addressToGet, "NEO", "#walletNeo" + ka);
            getAllNeoOrGasFromNeoCli(addressToGet, "GAS", "#walletGas" + ka);
            if(!$("#cbx_query_neoscan")[0].checked)
              callClaimableFromNeoCli(addressToGet, "#walletClaim" + ka);
            else
              callClaimableFromNeoScan(addressToGet, "#walletClaim" + ka);

            if(!$("#cbx_query_neoscan")[0].checked)
              callUnclaimedFromNeoCli(addressToGet, "#walletUnclaim" + ka);
            else
              callUnclaimedFromNeoScan(addressToGet, "#walletUnclaim" + ka);
        }
}


//Old script used for claiming with vector that was updated with all pending claims
/*
function callFromAllKnownThatHasClaimable()
{
  //console.log("ADDRESSES_TO_CLAIM.length is:" + ADDRESSES_TO_CLAIM.length);
  if(ADDRESSES_TO_CLAIM.length>0)
  {
    for(i = 0; i < ADDRESSES_TO_CLAIM.length; ++i)
    {
      //console.log("Current address for claiming is:" + ADDRESSES_TO_CLAIM[i] + " ALL ECO_WALLET are:")
      //console.log(ECO_WALLET)
      var idToTransfer = searchAddrIndexFromBase58(ADDRESSES_TO_CLAIM[i]);

      if (idToTransfer > -1)
      {
            if(ECO_WALLET[idToTransfer].account.isMultiSig)
	    {
		jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToTransfer);
		//Multi-sig address
		createClaimMSGasTX(idToTransfer,jsonArrayWithPrivKeys,getCurrentNetworkNickname());
	    }else //not multisig- normal address
            {
	  	createClaimGasTX(idToTransfer, BASE_PATH_CLI, getCurrentNetworkNickname());
            }
      }
    }
  }
}

function updateClaimable(amountClaimable, addressToClaim)
{
    //console.log("amountClaimable is " +  amountClaimable + " of "+ addressToClaim);
    indexInsideAddressToClaim = ADDRESSES_TO_CLAIM.indexOf(addressToClaim);
    if(amountClaimable>0)
    {
	if (indexInsideAddressToClaim == -1)
		ADDRESSES_TO_CLAIM.push(addressToClaim);
  	        //console.log("addresses pending claim are " + ADDRESSES_TO_CLAIM)
    }else
    {
    	if (indexInsideAddressToClaim != -1)
		ADDRESSES_TO_CLAIM.splice(indexInsideAddressToClaim, 1);
    }
}
*/

function selfTransfer(idToTransfer) {
    if (idToTransfer < ECO_WALLET.length && idToTransfer > -1) {
        getAllNeoOrGasFromNeoCli(ECO_WALLET[idToTransfer].account.address, "NEO", "", true);
    } else {
        alert("Cannot transfer anything from " + idToTransfer + " from set of known addresses with size " + ECO_WALLET.length)
    }
}

// ==================================================
// ======== QUERY BALANCES FROM NEOSCAN =============
// ==================================================
function callUnclaimedFromNeoScan(adddressToGet, boxToFill = "") {
    url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_unclaimed/" + adddressToGet;
    $.getJSON(url_toFill, function(result) {
        var amountUnclaimable = 0;
        if (result.unclaimed)
            amountUnclaimable = result.unclaimed;

        if (boxToFill != "")
            $(boxToFill).val(amountUnclaimable);

        return amountUnclaimable;
    });
}

function callClaimableFromNeoScan(adddressToGet, boxToFill = "") {
    url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_claimable/" + adddressToGet;
    $.getJSON(url_toFill, function(resultClaimable) {
        //console.log("resultClaimable is:");
        //console.log(resultClaimable);
        var amountClaimable = 0;
        if (resultClaimable.unclaimed)
            amountClaimable = resultClaimable.unclaimed;

        if (resultClaimable.address && amountClaimable > 0) {
            idToAutomaticClaim = searchAddrIndexFromBase58(resultClaimable.address);
            //console.log("Current gas inside claimable query is " + $("#walletGas" + idToAutomaticClaim).val() );
            if ($("#walletGas" + idToAutomaticClaim).val() == map[resultClaimable.address])
                automaticClaim(amountClaimable, idToAutomaticClaim);
            map[resultClaimable.address] = $("#walletGas" + idToAutomaticClaim).val();
            //console.log(map);
        }

        if (boxToFill != "")
            $(boxToFill).val(amountClaimable);

        return amountClaimable;
    });
}

// ==================================================

// ==================================================
//DEPRECATED
function getAllNeoOrGasFromNeoScan(adddressToGet, assetToGet, boxToFill = "", automaticTransfer = false, to = "") {
    var url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + adddressToGet;
    //console.log("url_toFill: " + url_toFill);
    $.getJSON(url_toFill, function(result) {
        if (boxToFill != "")
            $(boxToFill).val(0);

        if (result.balance) {
            for (i = 0; i < result.balance.length; ++i) {
                if (result.balance[i].asset == assetToGet) {
                    //console.log(assetToGet + " balance is:" + result.balance[i].amount);
                    if (boxToFill != "")
                        $(boxToFill).val(result.balance[i].amount);
                    if (automaticTransfer) {
                        if (to === "")
                            to = adddressToGet;

                        var idToTransfer = searchAddrIndexFromBase58(adddressToGet);
                        //console.log("idToTransfer:" + idToTransfer);
                        if (idToTransfer != -1 && result.balance[i].amount != 0) {
                            if (ECO_WALLET[idToTransfer].account.isMultiSig) {
                                //Multi-sig address
                                neoToSend = 0;
                                gasToSend = 0;
                                if (assetToGet == "NEO")
                                    neoToSend = result.balance[i].amount;
                                else
                                    gasToSend = result.balance[i].amount;
                                createTxFromMSAccount(idToTransfer, to, neoToSend, gasToSend, getCurrentNetworkNickname());
                            } else {
                                createTxFromAccount(idToTransfer, to, result.balance[i].amount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
                            }
                        }


                    }
                }
            }
        }


    });
}
// ==================================================
// ======== QUERY BALANCES FROM NEOSCAN =============
// ==================================================
