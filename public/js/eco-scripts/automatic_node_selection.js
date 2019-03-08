function automaticNeoCliNodeSelection(){
          if(AUTOMATIC_PIC_CSHARP_NODE_BEST_HEGITH)
          {
            var availableNodes = $("#selectionBoxRPCNodes")[0].length;
            var bestNode = $("#selectionBoxRPCNodes")[0][0].value;
            var bestHeight = 0;
	    var maxNumberOfNodesToTry = Math.min(3,availableNodes);
	    var randomNodes = new Array(maxNumberOfNodesToTry);
	    for(var i=0;i<maxNumberOfNodesToTry;i++)
		randomNodes[i]=-1;
            for(var t=0;t<maxNumberOfNodesToTry;t++)
            {
		    var randomNode = Math.floor(Math.random() * maxNumberOfNodesToTry);
		    while(randomNodes[t] == randomNode)
			randomNode = Math.floor(Math.random() * maxNumberOfNodesToTry);
		    randomNodes[t] = randomNode;
              	    var neoCliNodeToGetHeight = $("#selectionBoxRPCNodes")[0][randomNode].value;

		    requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": "+randomNode+", \"method\": \"getblockcount\", \"params\": [\"\"] }";
		    //console.log(requestJson);

		    $.post(
		        neoCliNodeToGetHeight, // Gets the URL to sent the post to
		        requestJson, // Serializes form data in standard format
		        function (resultJsonData) {
		           //console.log(resultJsonData);
			   var nodeHeight = resultJsonData.result;
			   var nodeId = resultJsonData.id;
		           if(nodeHeight > bestHeight)
		           {		
				    bestHeight = nodeHeight;
				    bestNode = nodeId;
				    if(bestNode != BASE_PATH_CLI)
				    {
				      //console.log("Going to update to bestNode " + bestNode + " at height " + nodeHeight);
				      BASE_PATH_CLI = $("#selectionBoxRPCNodes")[0][nodeId].value;
				      $("#rpc_nodes_path")[0].value = $("#selectionBoxRPCNodes")[0][nodeId].value;
				    }
			   }
		        },
		        "json" // The format the response should be in
		    ).fail(function() {
			console.error('Could not call the api of node URL', neoCliNodeToGetHeight);
			//createNotificationOrAlert("automaticNeoCliNodeSelection", "failed to get node height " + neoCliNodeToGetHeight, 3000);
		    }); //End of POST for search
            }
          } //automatic node checkbox
}
