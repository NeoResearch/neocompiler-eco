function automaticClaim(amountClaimable, idToAutomaticClaim)
{
    //console.log("amountClaimable is " +  amountClaimable + " of index "+ idToAutomaticClaim);
    
    if(idToAutomaticClaim != -1)
    {
	    if(ECO_WALLET[idToAutomaticClaim].account.isMultiSig)
	    {
		jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToAutomaticClaim);
		//Multi-sig address
		createClaimMSGasTX(idToAutomaticClaim,jsonArrayWithPrivKeys,getCurrentNetworkNickname());
	    }else //not multisig- normal address
            {
	  	createClaimGasTX(idToAutomaticClaim, BASE_PATH_CLI, getCurrentNetworkNickname());
            }
    }
}

function callClaimableFromNeoCli(adddressToGet,boxToFill="")
{
            var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getclaimable\", \"params\": [\""+adddressToGet+"\"] }";
            //console.log("getclaimable request to: "+BASE_PATH_CLI);
            $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                requestJson, // Serializes form data in standard format
                function (resultClaimable) {
		      console.log(resultClaimable);
		      var amountClaimable = 0;
		      if(resultClaimable.result)
		      	amountClaimable = resultClaimable.result.unclaimed;

		      if(resultClaimable.result.address && amountClaimable>0)
		      {
			var resultQueryAddress = resultClaimable.result.address;
			idToAutomaticClaim = searchAddrIndexFromBase58(resultQueryAddress);
			//console.log("Current gas inside claimable query is " + $("#walletGas" + idToAutomaticClaim).val() );
			if($("#walletGas" + idToAutomaticClaim).val() == map[resultQueryAddress])
		      		automaticClaim(amountClaimable,idToAutomaticClaim);
			map[resultQueryAddress] = $("#walletGas" + idToAutomaticClaim).val();
			//console.log(map);
		      }

		      if(boxToFill!="")
			       $(boxToFill).val(amountClaimable);
		     return amountClaimable;		    
                },
                "json" // The format the response should be in
            ).fail(function() {
		console.error("callClaimableFromNeoCli problem. failed to pass request to RPC network!");
            }); //End of POST for search
}

function callUnclaimedFromNeoCli(adddressToGet,boxToFill="")
{
            var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getunclaimed\", \"params\": [\""+adddressToGet+"\"] }";
            //console.log("getclaimable request to: "+BASE_PATH_CLI);
            $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                requestJson, // Serializes form data in standard format
                function (resultUnclaimed) {
		    console.log(resultUnclaimed);
		    var amountUnclaimable = 0;
		    if(resultUnclaimed.unclaimed)
		    	amountUnclaimable = resultUnclaimed.unclaimed;

		    if(boxToFill!="")
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
function getAllNeoOrGasFrom(adddressToGet, assetToGet,boxToFill="", automaticTransfer = false, to = "")
{
	    var assetToGetHash = 0xc56f33fc6ecfcd0c225c4ab356fee59390af8560be0e930faebe74a6daff7c9b;
	    if(assetToGet == "GAS")
		assetToGetHash = 0x602c79718b16e442de58778e148d0b1084e3b2dffd5de6b7b16cee7969282de7;

            //console.log("formating as json for RPC request...");
            requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getaccountstate\", \"params\": [\""+adddressToGet+"\"] }";
            //console.log(requestJson);

            //console.log("getaccountstate request to: "+BASE_PATH_CLI);
            $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                requestJson, // Serializes form data in standard format
                function (resultJsonData) {
		    if(boxToFill!="")
	    		$(boxToFill).val(0);


		    if(resultJsonData.result)
		    {
		      for( i = 0; i < resultJsonData.result.balances.length; ++i)
		      {
		    	  if(resultJsonData.result.balances[i].asset == assetToGetHash)
		    	  {
  			      var availableAmount = resultJsonData.result.balances[i].value;
		    	      //console.log(assetToGet + " balance is:" + result.balance[i].amount);
		    	      if(boxToFill!="")
		    		      $(boxToFill).val(availableAmount);
			      if(automaticTransfer)
			      {
				 if(to==="")
				 	to = adddressToGet;

				 var idToTransfer = searchAddrIndexFromBase58(adddressToGet);
				 //console.log("idToTransfer:" + idToTransfer);
				 if (idToTransfer != -1 && availableAmount!=0){
					 if(ECO_WALLET[idToTransfer].account.isMultiSig)
					 {
						//Multi-sig address
						neoToSend = 0;
						gasToSend = 0;
						if(assetToGet == "NEO")
							neoToSend = availableAmount;
						else
							gasToSend = availableAmount;
						createTxFromMSAccount(idToTransfer, to, neoToSend, gasToSend, getCurrentNetworkNickname());
					 }else
					 {
					 	createTxFromAccount(idToTransfer,to, availableAmount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
					 }
				}


			      }
		    	  }
		       }
		    }
                },
                "json" // The format the response should be in
            ).fail(function() {
		console.error("getAllNeoOrGasFrom problem. failed to pass request to RPC network!");
		//createNotificationOrAlert("getAllNeoOrGasFrom problem", "failed to pass request to RPC network!", 3000);
            }); //End of POST for search
}

function fillAllNeo()
{
  var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
  getAllNeoOrGasFrom(ECO_WALLET[addrFromIndex].account.address,"NEO","#createtx_NEO");
}

function fillAllGas()
{
  var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
  getAllNeoOrGasFrom(ECO_WALLET[addrFromIndex].account.address,"GAS","#createtx_GAS");
}

function fillWalletInfo(result)
{
    var data = "";
    if(result.balance)
    {
      for( i = 0; i < result.balance.length; ++i)
  	data += result.balance[i].amount + " " + result.balance[i].asset + "\t";
    }else {
      data += "This address seems to not have any fund."
    }
    return data;
}


function populateAllWalletData()
{
    drawWalletsStatus();

    for(ka = 0; ka < ECO_WALLET.length; ++ka)
      if(ECO_WALLET[ka].print == true && !isEncryptedOnly(ka))
      {
	      addressToGet = ECO_WALLET[ka].account.address;
	      //walletIndex = searchAddrIndexFromBase58(addressToGet);
	      getAllNeoOrGasFrom(addressToGet,"NEO","#walletNeo" + ka);
	      getAllNeoOrGasFrom(addressToGet,"GAS","#walletGas" + ka);
	      callClaimableFromNeoCli(addressToGet,"#walletClaim" + ka);
	      callUnclaimedFromNeoCli(addressToGet,"#walletUnclaim" + ka);
      }
}


//===============================================================
function drawWalletsStatus(){
  //Clear previous data
  document.getElementById("divWalletsStatus").innerHTML = "";
  var table = document.createElement("table");
  table.setAttribute('class', 'table');
  table.style.width = '20px';

  var row = table.insertRow(-1);
  var headers1 = document.createElement('div');
  var headers2 = document.createElement('div');
  var headers3 = document.createElement('div');
  var headers4 = document.createElement('div');
  var headers5 = document.createElement('div');
  var headers6 = document.createElement('div');
  var headersDetails = document.createElement('div');
  headers1.innerHTML = "<b> ID </b>";
  row.insertCell(-1).appendChild(headers1);
  headersDetails.innerHTML = "<b> PUBKEY </b>";
  row.insertCell(-1).appendChild(headersDetails);
  headers2.innerHTML = "<b> NEO </b>";
  row.insertCell(-1).appendChild(headers2);
  headers3.innerHTML = "<b> GAS </b>";
  row.insertCell(-1).appendChild(headers3);
  headers4.innerHTML = "<b> CLAIMABLE </b>";
  row.insertCell(-1).appendChild(headers4);
  headers5.innerHTML = "<b> </b>";
  row.insertCell(-1).appendChild(headers5);
  headers6.innerHTML = "<b> UNCLAIMABLE </b>";
  row.insertCell(-1).appendChild(headers6);

  for (ka = 0; ka < ECO_WALLET.length; ka++) 
  {
	  if(ECO_WALLET[ka].print == true && !isEncryptedOnly(ka))
	  {
	      var txRow = table.insertRow(-1);
	      //row.insertCell(-1).appendChild(document.createTextNode(i));
	      //Insert button that remove rule
	      var b = document.createElement('button');
	      b.setAttribute('content', 'test content');
	      b.setAttribute('class', 'btn btn-danger');
	      b.setAttribute('value', ka);
	      //b.onclick = function () {buttonRemoveRule();};
	      //b.onclick = function () {alert(this.value);};
	      b.onclick = function () {removeAccountFromEcoWallet(this.value);};
	      b.innerHTML = ka;
	      txRow.insertCell(-1).appendChild(b);

	      var addressBase58 = document.createElement("a");
	      var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + ECO_WALLET[ka].account.address;
	      addressBase58.text = ECO_WALLET[ka].account.address.slice(0,4) + "..." + ECO_WALLET[ka].account.address.slice(-4);
	      addressBase58.href = urlToGet;
	      addressBase58.target = 'popup';
	      addressBase58.onclick= urlToGet;
	      addressBase58.style.width = '70px';
	      addressBase58.style.display = 'block';
	      txRow.insertCell(-1).appendChild(addressBase58);

	      var walletNeo = document.createElement('input');
	      walletNeo.setAttribute('id', "walletNeo"+ka);
	      walletNeo.setAttribute("value", "-");
	      walletNeo.setAttribute("readonly","true");
	      walletNeo.style.width = '90px'
	      txRow.insertCell(-1).appendChild(walletNeo);

	      var walletGas = document.createElement('input');
	      walletGas.setAttribute('id', "walletGas"+ka);
	      walletGas.setAttribute("value", "-");
	      walletGas.setAttribute("readonly","true");
	      walletGas.style.width = '80px'
	      txRow.insertCell(-1).appendChild(walletGas);

	      var walletClaim = document.createElement('input');
	      walletClaim.setAttribute('id', "walletClaim"+ka);
	      walletClaim.setAttribute("value", "-");
	      walletClaim.setAttribute("readonly","true");
	      walletClaim.style.width = '80px'
	      txRow.insertCell(-1).appendChild(walletClaim);

	      var b = document.createElement('button');
	      b.setAttribute('content', 'test content');
	      b.setAttribute('class', 'btn btn-warning');
	      b.setAttribute('value', ka);
	      b.onclick = function () {selfTransfer(this.value);};
	      b.innerHTML = '<i class="fas fa-sm fa-arrow-left"></i>';

	      txRow.insertCell(-1).appendChild(b);

	      var walletUnclaim = document.createElement('input');
	      walletUnclaim.setAttribute('id', "walletUnclaim"+ka);
	      walletUnclaim.setAttribute("value", "-");
	      walletUnclaim.setAttribute("readonly","true");
	      walletUnclaim.style.width = '80px'
	      txRow.insertCell(-1).appendChild(walletUnclaim);
	   } //Check print and encrypted status
  }//Finishes loop that draws each relayed transaction

  document.getElementById("divWalletsStatus").appendChild(table);
}//Finishe DrawWallets function
//===============================================================

//===============================================================
//================ ADD NEW ADDRESS ==============================
function addWalletFromForm(){
   	//console.log("addWallet()");
        addressBase58ToAdd = document.getElementById('addressToAddBox').value;
        pubKeyToAdd = document.getElementById('pubKeyToAddBox').value;
        wifToAdd = document.getElementById('wifToAddBox').value;
	vsToAdd = document.getElementById('vsToAddBox').value;
	encryptedKeyToAdd = document.getElementById('encryptedKeyToAddBox').value;
	multiSigFlag = $("#cbx_multisig")[0].checked;

	var accountToAdd;
	if(encryptedKeyToAdd != '')
	{
		accountToAdd = new Neon.wallet.Account(encryptedKeyToAdd);		
	}else
	{ 
		if(multiSigFlag)
		{
			accountToAdd = getAccountFromMultiSigVerification(vsToAdd);
		}else
		{
			if(pubKeyToAdd != '' && wifToAdd==='')
			{
				accountToAdd = new Neon.wallet.Account(pubKeyToAdd);
			}
			else
			{
				if (addressBase58ToAdd != '' && wifToAdd==='' )
				{
					accountToAdd = new Neon.wallet.Account(addressBase58ToAdd);
				}
				else
				{
					if (wifToAdd != '')
					{
						accountToAdd = new Neon.wallet.Account(wifToAdd);
					}
					else 
				     	{
				     		alert("Error when adding wallet. Values looks all empty.");
				     		return false;
				     	}
				}
			}
		}
	}
	        
	var addedFlag = addToWallet(accountToAdd);
	if(addedFlag)
        	updateAllWalletData();
}

//TODO Add suport for adding multisig and specialSC
function addToWallet(accountToAdd)
{
	if(accountToAdd._encrypted != null)
	{
	        if(searchAddrIndexFromEncrypted(accountToAdd.encrypted) != -1)
		{
			alert("Encrypted key already registered. Please, delete index " + searchAddrIndexFromEncrypted(accountToAdd.encrypted) + " first.");
			return false;
		}
		ECO_WALLET.push({ account: accountToAdd, print: true});
		return true;
	}

	if(!accountToAdd.isMultiSig)
	{
		var addressBase58ToAdd = accountToAdd.address;

		console.log("pubAddressToAdd: '" + addressBase58ToAdd + "'");
		if(accountToAdd._WIF != null)
		{
			var wifToAdd = accountToAdd.WIF;
			console.log("wifToAdd: " + wifToAdd);
		 	if(!Neon.default.is.wif(wifToAdd) && wifToAdd!='')
			{
				alert("This WIF " + wifToAdd + " does not seems to be valid.");
				return false;
			}
					//console.log(getWifIfKnownAddress(wifToAdd));
			if(wifToAdd == '')
			{
				alert("WIF is null.");
				return false;
			}

			if(searchAddrIndexFromWif(wifToAdd) != -1)
			{
				alert("WIF already registered. Please, delete index " + searchAddrIndexFromWif(wifToAdd) + " first.");
				return false;
			}
	   		console.log("wif " + wifToAdd + " is ok!");
		}

		//TODO Check if addressBase58 already exists by getting it from wif
		if(searchAddrIndexFromBase58(addressBase58ToAdd) != -1)
		{
			alert("Public addressBase58 already registered. Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.");
			return false;
		}
		
	 	if(!Neon.default.is.address(addressBase58ToAdd) && addressBase58ToAdd!='')
		{
			alert("Public addressBase58 " + addressBase58ToAdd + " is not being recognized as a valid address.");
			return false;
		}
	   	console.log("Address " + addressBase58ToAdd + " is ok!");

		if(accountToAdd._publicKey != null)
		{
			if(!Neon.default.is.publicKey(accountToAdd.publicKey) && accountToAdd.publicKey!='')
			{
				alert("Public key " + accountToAdd.publicKey + " is not being recognized as a valid address.");
				return false;
			}
			console.log("pubKey " + accountToAdd.publicKey + " is ok!");
		}


		ECO_WALLET.push({ account: accountToAdd, print: true});
		return true; 
	}

	if(accountToAdd.isMultiSig)
	{
		var vsToAdd = accountToAdd.contract.script;
		if(vsToAdd == '')
		{
			alert("Verification script is empty for this multisig!");
			return false;
		}

		if(accountToAdd.address != toBase58(getScriptHashFromAVM(vsToAdd)))
		{
			alert("Error on converting verification script to base58");
			return false;
		}

		if(searchAddrIndexFromBase58(addressBase58ToAdd) != -1)
		{
			alert("Public addressBase58 already registered for this MultiSig. Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.");
			return false;
		}
		ECO_WALLET.push({ account: accountToAdd, print: true, owners: ''});
		return true;
	}
}
//===============================================================

//===============================================================
//============= FUNCTION CALLED WHEN SELECTION BOX CHANGES ======
function changeWalletInfo(){
	var wToChangeIndex = $("#wallet_info")[0].selectedOptions[0].index;
	
	if(isEncryptedOnly(wToChangeIndex))
	{
		$("#dialog").show();
		document.getElementById("walletInfoEncrypted").value = ECO_WALLET[wToChangeIndex].account.encrypted;
		document.getElementById("walletInfoAddressBase58").value = "-";
		document.getElementById("walletInfoScripthash").value = "-";
		document.getElementById("walletInfoPubKey").value = "-";
		document.getElementById("walletInfoWIF").value = "-";
		document.getElementById("walletInfoPrivateKey").value = "-";
		document.getElementById("addressPrintInfo").value = "-";
		document.getElementById("addressVerificationScript").value = "-";
		document.getElementById("addressOwners").value = "-";
	}
	else
	{

		document.getElementById("walletInfoAddressBase58").value = ECO_WALLET[wToChangeIndex].account.address;
		
		if(ECO_WALLET[wToChangeIndex].account._encrypted != null)
		{
			document.getElementById("walletInfoEncrypted").value = ECO_WALLET[wToChangeIndex].account.encrypted;
		}
		else 
		{
			$("#dialog").hide();		
			document.getElementById("walletInfoEncrypted").value = "-";
		}

		document.getElementById("walletInfoScripthash").value = JSON.stringify(ECO_WALLET[wToChangeIndex].account.scriptHash);

		if(!ECO_WALLET[wToChangeIndex].account.isMultiSig && ECO_WALLET[wToChangeIndex].account._publicKey != null)
			document.getElementById("walletInfoPubKey").value = ECO_WALLET[wToChangeIndex].account.publicKey;
		else 
			document.getElementById("walletInfoPubKey").value = "-";

		if(!ECO_WALLET[wToChangeIndex].account.isMultiSig && ECO_WALLET[wToChangeIndex].account._WIF != null)
			document.getElementById("walletInfoWIF").value = ECO_WALLET[wToChangeIndex].account.WIF;
		else
			document.getElementById("walletInfoWIF").value = "-";

		if(!ECO_WALLET[wToChangeIndex].account.isMultiSig && ECO_WALLET[wToChangeIndex].account._privateKey != null)
			document.getElementById("walletInfoPrivateKey").value = ECO_WALLET[wToChangeIndex].account.privateKey;
		else 
			document.getElementById("walletInfoPrivateKey").value = "-";

		document.getElementById("addressPrintInfo").value = ECO_WALLET[wToChangeIndex].print;
		document.getElementById("addressVerificationScript").value = ECO_WALLET[wToChangeIndex].account.contract.script;
		document.getElementById("addressOwners").value = JSON.stringify(ECO_WALLET[wToChangeIndex].owners);
	}
}
//===============================================================

//===============================================================
//============= UPDATE ALL KNOWN ADDRESSES ======================
function updateInfoMSOwners(){
          for(ka = 0; ka < ECO_WALLET.length; ++ka)
		if(!isEncryptedOnly(ka))
		 	if(ECO_WALLET[ka].account.isMultiSig)
			    if(ECO_WALLET[ka].owners === '')
			    	ECO_WALLET[ka].owners = getAddressBase58FromMultiSig(ECO_WALLET[ka].account.contract.script);
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function updateAddressSelectionBox(){
      updateInfoMSOwners();
      drawWalletsStatus();
      //Adding all known address to NeonInvokeSelectionBox
      addAllKnownAddressesToSelectionBox("wallet_invokejs");
      addAllKnownAddressesToSelectionBox("wallet_deployjs");
      addAllKnownAddressesToSelectionBox("wallet_info");
      //addAllKnownAddressesToSelectionBox("createtx_to");
      addAllKnownAddressesToSelectionBox("createtx_from");
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function addAllKnownAddressesToSelectionBox(walletSelectionBox){
          //Clear selection box
	  //var currentSelected = document.getElementById(walletSelectionBox).selectedOptions[0].index;
          document.getElementById(walletSelectionBox).options.length = 0;
          for(ka = 0; ka < ECO_WALLET.length; ++ka)
          {
	  	if(isEncryptedOnly(ka))
		    addOptionToSelectionBox("Encrypted: " + ECO_WALLET[ka].account.encrypted.slice(0,3) + "..." + ECO_WALLET[ka].account.encrypted.slice(-3),"wallet_"+ka,walletSelectionBox);
		else
	            addOptionToSelectionBox(ECO_WALLET[ka].account.address.slice(0,3) + "..." + ECO_WALLET[ka].account.address.slice(-3),"wallet_"+ka,walletSelectionBox);
          }
	  //document.getElementById(walletSelectionBox)[0].selectedIndex = 0; //currentSelected
}
//===============================================================

function updateAllWalletData(){
	populateAllWalletData();
	updateAddressSelectionBox();
	changeWalletInfo();
}

//===============================================================
function removeAccountFromEcoWallet(idToRemove){
  if(idToRemove < ECO_WALLET.length && idToRemove > -1)
  {
      ECO_WALLET.splice(idToRemove, 1);
      updateAllWalletData();
  }else{
      alert("Cannot remove TX with ID " + idToRemove + " from set of known addresses with size " + ECO_WALLET.length)
  }
}
//===============================================================
function selfTransfer(idToTransfer){
  if(idToTransfer < ECO_WALLET.length && idToTransfer > -1)
  {
      	getAllNeoOrGasFrom(ECO_WALLET[idToTransfer].account.address,"NEO","",true);
  }else{
        alert("Cannot transfer anything from " + idToTransfer + " from set of known addresses with size " + ECO_WALLET.length)
  }
}

function decrypt()
{
	var idToDecrypt = $("#wallet_info")[0].selectedOptions[0].index;
	var encryptedKey = ECO_WALLET[idToDecrypt].account.encrypted;
	var passValue = $("#passwordNep2").val();
	$("#passwordNep2").val("");
	console.log("idToDecrypt: " + idToDecrypt + " encryptedKey " + encryptedKey);
	console.log("passValue: " + passValue);

	ECO_WALLET[idToDecrypt].account.decrypt(passValue).then(decryptedWallet => {
		removeAccountFromEcoWallet(idToDecrypt);
	 	createNotificationOrAlert("Wallet decrypted!","Address: " + decryptedWallet.address, 5000);
		addToWallet(decryptedWallet);
		updateAllWalletData();
	}).catch(err => {
	     	console.log(err);
		createNotificationOrAlert("Wallet decryptation ERROR","Response: " + err, 5000);
   	});
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

// ==================================================
//DEPRECATED
function callUnclaimedNeonQueryFromNeoScan(adddressToGet,boxToFill="")
{
  url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_unclaimed/" + adddressToGet;
  $.getJSON(url_toFill, function(result) {
    var amountUnclaimable = 0;
    if(result.unclaimed)
    	amountUnclaimable = result.unclaimed;

    if(boxToFill!="")
      $(boxToFill).val(amountUnclaimable);

    return amountUnclaimable;
  });
}

function callClaimableNeonQueryFromNeoScan(adddressToGet,boxToFill="")
{
  url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_claimable/" + adddressToGet;
  $.getJSON(url_toFill, function(resultClaimable) {
      //console.log("resultClaimable is:");
      //console.log(resultClaimable);
      var amountClaimable = 0;
      if(resultClaimable.unclaimed)
      	amountClaimable = resultClaimable.unclaimed;

      if(resultClaimable.address && amountClaimable>0)
      {
        idToAutomaticClaim = searchAddrIndexFromBase58(resultClaimable.address);
        //console.log("Current gas inside claimable query is " + $("#walletGas" + idToAutomaticClaim).val() );
	if($("#walletGas" + idToAutomaticClaim).val() == map[resultClaimable.address])
      		automaticClaim(amountClaimable,idToAutomaticClaim);
        map[resultClaimable.address] = $("#walletGas" + idToAutomaticClaim).val();
        //console.log(map);
      }

      if(boxToFill!="")
	       $(boxToFill).val(amountClaimable);

      return amountClaimable;
  });
}

// ==================================================

// ==================================================
//DEPRECATED
function getAllNeoOrGasFromNeoScan(adddressToGet, assetToGet,boxToFill="", automaticTransfer = false, to = "")
{
  var url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + adddressToGet;
  //console.log("url_toFill: " + url_toFill);
  $.getJSON(url_toFill, function(result) {
    if(boxToFill!="")
	    $(boxToFill).val(0);

    if(result.balance)
    {
      for( i = 0; i < result.balance.length; ++i)
      {
    	  if(result.balance[i].asset == assetToGet)
    	  {
    	      //console.log(assetToGet + " balance is:" + result.balance[i].amount);
    	      if(boxToFill!="")
    		      $(boxToFill).val(result.balance[i].amount);
	      if(automaticTransfer)
	      {
		 if(to==="")
		 	to = adddressToGet;

		 var idToTransfer = searchAddrIndexFromBase58(adddressToGet);
		 //console.log("idToTransfer:" + idToTransfer);
		 if (idToTransfer != -1 && result.balance[i].amount!=0){
			 if(ECO_WALLET[idToTransfer].account.isMultiSig)
			 {
				//Multi-sig address
				neoToSend = 0;
				gasToSend = 0;
			        if(assetToGet == "NEO")
					neoToSend = result.balance[i].amount;
				else
					gasToSend = result.balance[i].amount;
				createTxFromMSAccount(idToTransfer, to, neoToSend, gasToSend, getCurrentNetworkNickname());
			 }else
			 {
			 	createTxFromAccount(idToTransfer,to, result.balance[i].amount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
			 }
		}


	      }
    	  }
       }
    }


  });
}
//DEPRECATED
// ==================================================
