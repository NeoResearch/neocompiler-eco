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
				var rawTXParams = { wtx: wtx}
				updateVecRelayedTXsAndDraw(txHash,"RawTX","-",JSON.stringify(rawTXParams));
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

$("#getnep5balance").submit(function (e) {
	    e.preventDefault(); // Prevents the page from refreshing
	    $("#output_getnep5").val("");
	    $("#output_getnep5_extra").val("");
	    var addressRevertedScriptHash = revertHexString(fromBase58($("#getnep5_address")[0].value));

	    strrequest = '{ "jsonrpc": "2.0", "id": 5, "method": "getstorage", "params": ["'+$("#getnep5_contract")[0].value+'","'+addressRevertedScriptHash+'"]}';
	    //console.log($("#neonodeurl")[0].value);
	    //console.log(strrequest);
	    $.post(
		BASE_PATH_CLI, // Gets the Neo-CLi URL to sent the post to
		strrequest,
		function (data) {
		  //console.log(data);
		  valfixed8 = data.result;
		  const a = new fixed8FromHex(revertHexString(valfixed8));
		  $("#output_getnep5").val(a);

		  strgetblock = '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }';
		  $.post(
		      BASE_PATH_CLI, // Gets the URL to sent the post to
		      strgetblock,
		      function (data2) {
		        //console.log(data);
		        blockheight = data2.result;
		        //addr = toBase58($("#getnep5_address")[0].value);
			addr=$("#getnep5_address")[0].value;
		        $("#output_getnep5_extra").val(addr + " / H:"+blockheight);
		      },
		      "json" // The format the response should be in
		  ).fail(function() {
		      $("#output_getnep5_extra").val("failed to invoke network!");
		  }); //End of POST for search

		},
		"json" // The format the response should be in
	    ).fail(function() {
		$("#output_getnep5").val("failed to invoke network!");
	    }); //End of POST for search
});
