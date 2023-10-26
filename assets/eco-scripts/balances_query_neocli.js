function callUnclaimedFromNeoCli(adddressToGet, indexKA) {
    var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getunclaimedgas\", \"params\": [\"" + adddressToGet + "\"] }";
    //console.log("getclaimable request to: "+BASE_PATH_CLI);
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function (resultUnclaimed) {
            //console.log("resultUnclaimed")
            //console.log(resultUnclaimed);
            var amountUnclaimable = 0;
            if (resultUnclaimed.result)
                amountUnclaimable = resultUnclaimed.result.unclaimed / getFixed8();

            var selfTransferID = "selfTransfer(" + indexKA + ")";
            fillSpanTextOrInputBox("#walletUnclaim" + indexKA, '<a onclick=' + selfTransferID + '><i class="fas fa-sm fa-arrow-left"> ' + amountUnclaimable + '</i></a> ', amountUnclaimable);

            return amountUnclaimable;
        },
        "json" // The format the response should be in
    ).fail(function () {
        console.error("callUnclaimedFromNeoCli problem. failed to pass request to RPC network!");
    }); //End of POST for search
}

function queryNep17BalancesFromNeoCsharpNodeJsonRPC(adddressToGet, addressID) {
    requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getnep17balances\", \"params\": [\"" + adddressToGet + "\"] }";

    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        requestJson, // Serializes form data in standard format
        function (resultJsonData) {
            NUMBER_FAILS_REQUESTS = 0;
            $("#walletNEO" + addressID)[0].innerHTML = 0;
            $("#walletGAS" + addressID)[0].innerHTML = 0;
            if (resultJsonData.result) {
                ECO_WALLET[addressID]["nep17balances"] = resultJsonData.result.balance;

                //update transfers amounts if wallet is connect and is equal
                if (addressID == CONNECTED_WALLET_ID)
                    updateTransferLabel();

                for (i = 0; i < resultJsonData.result.balance.length; ++i) {
                    var availableAmount = resultJsonData.result.balance[i].amount;
                    if (resultJsonData.result.balance[i].assethash == NEO_ASSET)
                        $("#walletNEO" + addressID)[0].innerHTML = availableAmount;
                    if (resultJsonData.result.balance[i].assethash == GAS_ASSET)
                        $("#walletGAS" + addressID)[0].innerHTML = availableAmount / getFixed8();
                } // end loop for every asset
            } else {
                $("#walletNEO" + addressID)[0].innerHTML = "-";
                $("#walletGAS" + addressID)[0].innerHTML = "-";
            }
        },
        "json" // The format the response should be in
    ).fail(function () {
        console.error("queryNep17BalancesFromNeoCsharpNodeJsonRPC problem. failed to pass request to RPC network!");
        NUMBER_FAILS_REQUESTS++;
    }); //End of POST for search
}

function getStorage(adddressToGet, addressID) {
    var invokeparams = [];

    invokeparams.push(CONTRACTS_TO_LIST[getCurrentSelectedContract()].hash);
    invokeparams.push($("#storage_key")[0].value);

    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getstorage",
        "params": invokeparams
    };

    goToTabAndClick("nav-rpc");
    var jsonToCallStringified = JSON.stringify(jsonForInvokingFunction);
    $("#txtRPCJson").val(jsonToCallStringified);
    rawRpcCall(true);
}