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

function sendingTxPromiseWithEcoRaw(txPromise, txLoggingParams = null) {
    var txHash;
    const sendTxPromise = txPromise.then(transaction => {
            txHash = transaction.hash;
            
            // Sending using NEON-JS interface
	    const client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
            return client.sendRawTransaction(transaction.serialize(true));

	    /*
            console.log("sendingTxPromiseWithEcoRaw:");
            console.log(transaction);
            return sendRawTXToTheRPCNetwork(transaction.serialize(true), transaction.hash);*/
        })
        .then(res => {
            console.log("\n\n--- A response was achieved---");
            //console.log(res);
            if(txLoggingParams != null && res)
            {
                    updateVecRelayedTXsAndDraw(txHash, JSON.stringify(txLoggingParams));

                    // Jump to acitivy tab and record last tab
                    $('.nav-pills a[data-target="#activity"]').tab('show');
                    LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";
                    document.getElementById('divNetworkRelayed').scrollIntoView();

		    // TODO create personalized log for other types
                    createNotificationOrAlert("InvocationTransaction_Invoke", "Response: " + res + " ScriptHash: " + txLoggingParams.contract_scripthash + " tx_hash: " + txHash, 7000);
            }
        })
        .catch(err => console.log(err));
    return sendTxPromise;
}

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
