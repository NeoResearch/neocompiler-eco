function callUnclaimedFromNeoCli(adddressToGet, indexKA) {
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

            var selfTransferID = "selfTransfer(" + indexKA + ")";
            fillSpanTextOrInputBox("#walletUnclaim" + indexKA, '<a onclick=' + selfTransferID + '><i class="fas fa-sm fa-arrow-left"> ' + amountUnclaimable + '</i></a> ', amountUnclaimable);

            return amountUnclaimable;
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.error("callUnclaimedFromNeoCli problem. failed to pass request to RPC network!");
    }); //End of POST for search
}

function queryTofillNeoGasNep5FromNeoCli(adddressToGet, addressID) {
    requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getnep5balances\", \"params\": [\"" + adddressToGet + "\"] }";

    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultJsonData) {
            NUMBER_FAILS_REQUESTS = 0;
            fillSpanTextOrInputBox("#walletNeo" + addressID, 0);
            fillSpanTextOrInputBox("#walletGas" + addressID, 0);
            if (resultJsonData.result) {
                for (i = 0; i < resultJsonData.result.balance.length; ++i) {
                    var availableAmount = resultJsonData.result.balance[i].amount;
                    if(resultJsonData.result.balance[i].asset_hash == NEO_ASSET)
		    	        fillSpanTextOrInputBox("#walletNeo" + addressID, availableAmount);
                    if(resultJsonData.result.balance[i].asset_hash == GAS_ASSET)
		    	        fillSpanTextOrInputBox("#walletGas" + addressID, availableAmount/100000000);
                } // end loop for every asset
            } else {
            	fillSpanTextOrInputBox("#walletNeo" + addressID, "-");
           	    fillSpanTextOrInputBox("#walletGas" + addressID, "-");
            }
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.error("getAllNeoOrGasFromNeoCli problem. failed to pass request to RPC network!");
        NUMBER_FAILS_REQUESTS++;
    }); //End of POST for search
}

//GAS: 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7
//NEO: 0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b
function getAllNeoOrGasFromNeoCli(adddressToGet, assetToGet, boxToFill = "", automaticTransfer = false, to = "") {
    var assetToGetHash = 0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b;
    if (assetToGet == "GAS")
        assetToGetHash = 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7;
    requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getnep5balances\", \"params\": [\"" + adddressToGet + "\"] }";

    //console.log("getaccountstate request to: "+BASE_PATH_CLI);
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function(resultJsonData) {
            NUMBER_FAILS_REQUESTS = 0;
            fillSpanTextOrInputBox(boxToFill, 0);
            if (resultJsonData.result) {
                for (i = 0; i < resultJsonData.result.balances.length; ++i) {
                    if (resultJsonData.result.balances[i].asset == assetToGetHash) {
                        var availableAmount = resultJsonData.result.balances[i].value;
                        //console.log(assetToGet + " balance is:" + result.balance[i].amount);
                        fillSpanTextOrInputBox(boxToFill, availableAmount);

                        if (automaticTransfer) {
                            if (to === "")
                                to = adddressToGet;

                            var idToTransfer = searchAddrIndexFromBase58(adddressToGet);
                            //console.log("idToTransfer:" + idToTransfer);
                            if (idToTransfer != -1 && availableAmount != 0) {
                                if (ECO_WALLET[idToTransfer].account.isMultiSig) {
                                    //Multi-sig address
                                    var neoToSend = 0;
                                    var gasToSend = 0;
                                    if (assetToGet == "NEO")
                                        neoToSend = availableAmount;
                                    else
                                        gasToSend = availableAmount;
                                    createTxFromMSAccount(idToTransfer, to, neoToSend, gasToSend, getCurrentNetworkNickname());
                                } else {
                                    createTxFromAccount(idToTransfer, to, availableAmount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
                                }
                            } // end amount check
                        } // end automatic transfer
                    } // Asset hash was the one we were looking for
                } // end loop for every asset
            } else {
                fillSpanTextOrInputBox(boxToFill, "-"); //fills with 0 if reponse does not have result
            }
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.error("getAllNeoOrGasFromNeoCli problem. failed to pass request to RPC network!");
        NUMBER_FAILS_REQUESTS++;
    }); //End of POST for search
}