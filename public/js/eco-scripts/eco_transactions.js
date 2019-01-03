    //===============================================================
    function buttonRemoveTX(idToRemove){
      if(idToRemove < vecRelayedTXs.length && idToRemove > -1)
      {
          vecRelayedTXs.splice(idToRemove, 1);
          drawRelayedTXs();
      }else{
        alert("Cannot remove TX with ID " + idToRemove + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
    }
    //===============================================================

    //===============================================================
    function drawRelayedTXs(){
    	//Clear previous data
      document.getElementById("divRelayedTXs").innerHTML = "";
      var table = document.createElement("table");
      table.setAttribute('class', 'table');
      table.style.width = '20px';

      var row = table.insertRow(-1);
      var headers1 = document.createElement('div');
      var headers2 = document.createElement('div');
      var headersTxType = document.createElement('div');
      var headerstxScriptHash = document.createElement('div');
      var headerstxParams = document.createElement('div');
      var headers4 = document.createElement('div');
      var headersAppLog = document.createElement('div');
      var headersRestore = document.createElement('div');
      headers1.innerHTML = "<b> ID </b>";
      row.insertCell(-1).appendChild(headers1);
      headersAppLog.innerHTML = "<b> VM Status (Click for Info)</b>";
      row.insertCell(-1).appendChild(headersAppLog);
      headersRestore.innerHTML = "<b> Restore </b>";
      row.insertCell(-1).appendChild(headersRestore);
      headersTxType.innerHTML = "<b> txType </b>";
      row.insertCell(-1).appendChild(headersTxType);
      headerstxScriptHash.innerHTML = "<b> txScriptHash </b>";
      row.insertCell(-1).appendChild(headerstxScriptHash);
      headerstxParams.innerHTML = "<b> txParams </b>";
      row.insertCell(-1).appendChild(headerstxParams);
      headers2.innerHTML = "<b> TX on NeoScan </b>";
      row.insertCell(-1).appendChild(headers2);


      for (i = 0; i < vecRelayedTXs.length; i++) {
          var txRow = table.insertRow(-1);
          //row.insertCell(-1).appendChild(document.createTextNode(i));
          //Insert button that remove rule
          var b = document.createElement('button');
          b.setAttribute('content', 'test content');
          b.setAttribute('class', 'btn btn-danger');
          b.setAttribute('value', i);
          //b.onclick = function () {buttonRemoveRule();};
          //b.onclick = function () {alert(this.value);};
          b.onclick = function () {buttonRemoveTX(this.value);};
          b.innerHTML = i;
          txRow.insertCell(-1).appendChild(b);

          var bGoToAppLog = document.createElement('button');
          bGoToAppLog.setAttribute('content', 'test content');
          bGoToAppLog.setAttribute('class', 'btn btn-info');
          bGoToAppLog.setAttribute('value', i);
          bGoToAppLog.setAttribute('id', "appLogNeoCli"+i);
          bGoToAppLog.onclick = function () {callAppLog(this.value);};
          bGoToAppLog.innerHTML = '?';
          txRow.insertCell(-1).appendChild(bGoToAppLog);

	  if(vecRelayedTXs[i].txType === "Invoke")
	  {
		  var bRestore = document.createElement('button');
		  bRestore.setAttribute('content', 'test content');
		  bRestore.setAttribute('class', 'btn btn-info');
		  bRestore.setAttribute('value', i);
		  bRestore.onclick = function () {restoreInvokeTX(this.value);};
		  bRestore.innerHTML = 'R_I';
		  txRow.insertCell(-1).appendChild(bRestore);
	  }else{
		  var bRestore = document.createElement('button');
		  bRestore.setAttribute('content', 'test content');
		  bRestore.setAttribute('class', 'btn btn-info');
		  bRestore.setAttribute('value', i);
		  bRestore.onclick = function () {restoreDeployTX(this.value);};
		  bRestore.innerHTML = 'R_D';
		  txRow.insertCell(-1).appendChild(bRestore);
	  }


          var inputTxType = document.createElement("input");
          //input.setAttribute("type", "hidden");
          inputTxType.setAttribute("name", "textTxType"+i);
          inputTxType.setAttribute("readonly","true");
          inputTxType.style.width = '70px';
          inputTxType.setAttribute("value", vecRelayedTXs[i].txType);
          txRow.insertCell(-1).appendChild(inputTxType);

          var inputSH = document.createElement("input");
          //input.setAttribute("type", "hidden");
          inputSH.setAttribute("name", "textScriptHash"+i);
          inputSH.setAttribute("readonly","true");
          inputSH.style.width = '120px';
          inputSH.setAttribute("value", vecRelayedTXs[i].txScriptHash);
          txRow.insertCell(-1).appendChild(inputSH);


          var inputParams = document.createElement("input");
          //input.setAttribute("type", "hidden");
          inputParams.setAttribute("name", "textParams"+i);
          inputParams.setAttribute("readonly","true");
          inputParams.setAttribute("value", vecRelayedTXs[i].txParams);
          txRow.insertCell(-1).appendChild(inputParams);

	  /*
          //Check activation status
          var activationStatus = document.createElement('div');
          activationStatus.setAttribute('id', "activationStatus"+i);
          activationStatus.innerHTML = "-";
          txRow.insertCell(-1).appendChild(activationStatus);
	  */

          var txIDCell = document.createElement("a");
          var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[i].tx;
          txIDCell.text = vecRelayedTXs[i].tx.slice(0,5) + "..." + vecRelayedTXs[i].tx.slice(-5);
          txIDCell.href = urlToGet;
          txIDCell.target = '_blank';
          txIDCell.onclick = urlToGet;
          txIDCell.style.width = '70px';
	  txIDCell.style.display = 'block';
          txRow.insertCell(-1).appendChild(txIDCell);


          //This draw can be deprecated
          /*$.getJSON(urlToGet, function(result) {
              //console.log(result);
              if(result.txid == "not found" || result.vin == null){
                activationStatus.innerHTML = "<font color=\"blue\">PENDING</font>";
              }else{
                activationStatus.innerHTML = "<font color=\"green\">FOUND</font>";
              }
          }).fail(function (result) {
              activationStatus.innerHTML = "<font color=\"red\">FAILED</font>";
          });*/


          //Check activation status ends
    	}//Finishes loop that draws each relayed transaction

      document.getElementById("divRelayedTXs").appendChild(table);
      searchForTXs();
    }//Finishe DrawRules function
   //===============================================================

   //===============================================================
   //Update vector of relayed txs
   function updateVecRelayedTXsAndDraw(relayedTXID, actionType, txScriptHash, txParams)
   {
	   vecRelayedTXs.push({tx:relayedTXID, txType:actionType, txScriptHash:txScriptHash, txParams:txParams});
           drawRelayedTXs();
   }
   //===============================================================

   //===============================================================
   //Call app log
   function callAppLog(txID){
      if(txID < vecRelayedTXs.length && txID > -1)
      {
	     var txHash = vecRelayedTXs[txID].tx;
	     var appLogJson = [];
	     appLogJson.push({"jsonrpc": "2.0", "id": 5, "method": "getapplicationlog", "params": [vecRelayedTXs[txID].tx] });
	     $("#txtRPCJson").val(JSON.stringify(appLogJson));
	     $('#btnCallJsonRPC').click();
	     //$("#pillstab").children().eq(1).find('a').tab('show');
	     //$('.nav-pills li:eq(3) a').tab('show');
	     //document.getElementById('divFormJsonOut').scrollIntoView();
	     $('.nav-pills a[data-target="#rawRPC"]').tab('show');
      }else{
        alert("Cannot get log of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
   }
  //===============================================================

  //===============================================================
   //Restore Invoke tx
   function restoreInvokeTX(txID){
      if(txID < vecRelayedTXs.length && txID > -1)
      {
	     if(vecRelayedTXs[txID].txType === "Invoke")
	     {
		var invokeJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
	     	$("#invokehashjs").val(vecRelayedTXs[txID].txScriptHash);
	     	$("#invokeparamsjs").val(JSON.stringify(invokeJsonParams.neonJSParams));
		$("#attachgasfeejs").val(invokeJsonParams.mynetfee);
		$("#attachSystemgasjs").val(invokeJsonParams.mysysgasfee);
		$("#attachneojs").val(invokeJsonParams.neo);
		$("#attachgasjs").val(invokeJsonParams.gas);
		if(searchAddrIndexFromBase58(invokeJsonParams.caller) != -1)
			$("#wallet_invokejs")[0].selectedIndex = searchAddrIndexFromBase58(invokeJsonParams.caller);
	     }
      }else{
        alert("Cannot restore invoke of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
   }

   function restoreDeployTX(txID){
      if(txID < vecRelayedTXs.length && txID > -1)
      {
	     if(vecRelayedTXs[txID].txType === "Deploy")
	     {

		var deployJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
		console.log(deployJsonParams);
	     	$("#jsdeploy_name").val(deployJsonParams.contract_appname);
	     	$("#jsdeploy_desc").val(deployJsonParams.contract_description);
		$("#jsdeploy_email").val(deployJsonParams.contract_email);
		$("#jsdeploy_author").val(deployJsonParams.contract_author);
		$("#jsdeploy_version").val(deployJsonParams.contract_version);
		$("#contractparamsjs").val(deployJsonParams.par);
		$("#codeavm").val(deployJsonParams.contract_script);
		$("#contracthashjs").val(getScriptHashFromAVM(deployJsonParams.contract_script));
                $("#contractreturn")[0].value = getHexForType(deployJsonParams.returntype);
                $("#contractreturnjs")[0].value = getHexForType(deployJsonParams.returntype);

		if(deployJsonParams.storage == 0)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 1)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 2)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 3)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 4)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = true;
		}
		if(deployJsonParams.storage == 5)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = true;
		}
		if(deployJsonParams.storage == 6)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = true;
		}
		if(deployJsonParams.storage == 7)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = true;
		}


		if(searchAddrIndexFromBase58(deployJsonParams.caller) != -1)
			$("#wallet_deployjs")[0].selectedIndex = searchAddrIndexFromBase58(deployJsonParams.caller);

	     }

      }else{
        alert("Cannot restore deploy TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
   }
   //===============================================================

  //===============================================================
   //This function tries to search and verify for all relayed TXs that were, possible, broadcasted and included in the blockchain
   function searchForTXs(){
     //console.log("Searching tx's");
     for (i = 0; i < vecRelayedTXs.length; i++)
      searchForTX(i);
   }

   function exportHistory(){
	console.log(JSON.stringify(vecRelayedTXs));
   }

   function loadHistory(vecRelayedTXsToLoad){	
	vecRelayedTXs = vecRelayedTXsToLoad;
        drawRelayedTXs();
   }


   //===============================================================

   //===============================================================
   //This function tries to search and verify for a specific relayed TX that was, possible, broadcasted and included in the blockchain
   function searchForTX(indexToUpdate){

          //DEPRECATED QUERY FOR CHECKING IF FOUND ON NEOSCAN AND LINK TO Logs from csharp docker container
	  /*
          $.getJSON(BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[indexToUpdate].tx, function(result) {
              //console.log("div is activationStatus"+indexToUpdate);
              if(result.txid == "not found" || result.vin == null){
                document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"blue\">PENDING</font>";
              }else{
                document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"green\">FOUND</font><a target='_blank' href='txnotifications?txid="+vecRelayedTXs[indexToUpdate].tx+"'>(logs)</a>";
              }
          }).fail(function (result) {
              document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"red\">FAILED</font>";
          });
	  */

	  var jsonDataToCallNeoCli = [];
	  jsonDataToCallNeoCli.push({"jsonrpc": "2.0", "id": 5, "method": "getapplicationlog", "params": [vecRelayedTXs[indexToUpdate].tx] });

          $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                JSON.stringify(jsonDataToCallNeoCli), // Serializes form data in standard format
                function (data) {
		   //console.log(data);
		   if(data[0].result){
            if(data[0].result.vmstate) // 2.X
				     document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].result.vmstate;
				else
	              document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].result.executions[0].vmstate;
		   }else{
			   document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].error.code;
		   }
                },
                "json" // The format the response should be in
            ).fail(function() {
                document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = "FAILED";
          }); //End of POST for search
   }
  //===============================================================
