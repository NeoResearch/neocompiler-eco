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
			   createNotificationOrAlert("RPCRawTX", resultJsonData.result, 5000);

			   if(FULL_ACTIVITY_HISTORY)
			   {
				var rawTXParams = { wtx: wtx}
				updateVecRelayedTXsAndDraw(txHash,"RawTX","-",JSON.stringify(rawTXParams));
			   }

			   /*
			   if(typeof(resultJsonData.result) == "boolean") // 2.X
		  		createNotificationOrAlert("RPCRawTX", resultJsonData.result, 5000);
			   else // 3.X
		   		createNotificationOrAlert("RPCRawTX", "Status: " + resultJsonData.result.succeed +  " \nReason:" + resultJsonData.result.reason, 5000);*/
		   }else
		   {
			createNotificationOrAlert("RPCRawTX", "ERROR: " + resultJsonData.error.code +  " \nReason:" + resultJsonData.error.message, 5000);
		   }
                },
                "json" // The format the response should be in
            ).fail(function() {
		createNotificationOrAlert("RPCRawTX", "failed to pass transaction to network!", 5000);
            }); //End of POST for search
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
