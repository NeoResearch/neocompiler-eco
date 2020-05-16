function createJsonRpcCall(method, params)
{

}

function sendRawTXToTheRPCNetwork(wtx,txHash = "00"){
            console.log("formating as json for RPC request...");
            wtxjson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"sendrawtransaction\", \"params\": [\""+wtx+"\"] }";
            console.log(wtxjson);

            console.log("SENDING TO"+BASE_PATH_CLI);
            $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                wtxjson, // Serializes form data in standard format
                function (resultJsonData) {
		   console.log("sendRawTXToTheRPCNetwork:");
                   console.log(resultJsonData);
                   if(resultJsonData.result)
                   {
			   if(FULL_ACTIVITY_HISTORY)
			   {
				var rawTXParams = { wtx: wtx, type: "RawTX"}
				updateVecRelayedTXsAndDraw(txHash, JSON.stringify(rawTXParams));
			   }
			   createNotificationOrAlert("SendRaw_TX_NeoCli", "Status: " + resultJsonData.result, 5000);
		   }else
		   {
			createNotificationOrAlert("SendRaw_TX_NeoCli", "ERROR: " + resultJsonData.error.code +  " \nReason:" + resultJsonData.error.message, 5000);
		   }
                },
                "json" // The format the response should be in
            ).fail(function() {
		createNotificationOrAlert("SendRaw_TX_NeoCli", "failed to pass transaction to network!", 5000);
            }); //End of POST for search
}

//Call nep5tokens balance
function getNep5TokensForAddress(addressID) {
    if (addressID < ECO_WALLET.length && addressID > -1) {
        var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getnep5balances\", \"params\": [\"" + ECO_WALLET[addressID].account.address + "\"] }";
        $("#txtRPCJson").val(requestJson);
        $('#btnCallJsonRPC').click();
        $('.nav-pills a[data-target="#rawRPC"]').tab('show');
    } else {
        alert("Cannot get unspents of addrs with ID " + addressID + " from set of address with size " + ECO_WALLET.length)
    }
}
//===============================================================

function getContractState(contractScriptHash, deployOrInvoke){
            console.log("formating as json for RPC request...");
            requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getcontractstate\", \"params\": [\""+contractScriptHash+"\"] }";
            console.log(requestJson);

            console.log("getContractState request to: "+BASE_PATH_CLI);
            $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                requestJson, // Serializes form data in standard format
                function (resultJsonData) {
                   console.log(resultJsonData);
                   if(resultJsonData.result)
                   {		
			if(deployOrInvoke)
			   	createNotificationOrAlert("DEPLOYING A CONTRACT THAT ALREADY EXISTS", "code_version: " + resultJsonData.result.code_version +  " name:" + resultJsonData.result.name, 3000);
		   }else{
			if(!deployOrInvoke)
				createNotificationOrAlert("INVOKING WITH CONTRACT NOT YET FOUND", "CODE: " + resultJsonData.error.code +  " Reason:" + resultJsonData.error.message, 3000);
		   }
                },
                "json" // The format the response should be in
            ).fail(function() {
		createNotificationOrAlert("CONTRACT STATE", "failed to pass request to RPC network!", 3000);
            }); //End of POST for search
}
