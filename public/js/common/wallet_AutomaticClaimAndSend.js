function searchAddrIndexFromBase58(addressBase58ToTryToGet)
{
  for(iToFind = 0; iToFind < KNOWN_ADDRESSES.length; ++iToFind)
      if(KNOWN_ADDRESSES[iToFind].addressBase58 == addressBase58ToTryToGet)
	     return iToFind;
  return -1;
}

function searchAddrIndexFromWif(wifToTryToGet)
{
  for(iToFind = 0; iToFind < KNOWN_ADDRESSES.length; ++iToFind)
      if(KNOWN_ADDRESSES[iToFind].pKeyWif == wifToTryToGet)
	     return iToFind;
  return -1;
}

function getWifIfKnownAddress(addressToTryToGet)
{
  var index = searchAddrIndexFromBase58(addressToTryToGet);
  if (index != -1)
      return KNOWN_ADDRESSES[index].pKeyWif;
  else
      return -1;
}

function fillPrivateKeyIfKnown(boxPublicFrom,boxPrivateTo)
{
  //console.log("public is "+ $(boxPublicFrom).val())

  var privateKeyToGet = getWifIfKnownAddress($(boxPublicFrom).val());
  if (privateKeyToGet != -1)
      $(boxPrivateTo).val(privateKeyToGet);
}

function callFromAllKnownThatHasClaimable()
{
  //console.log("ADDRESSES_TO_CLAIM.length is:" + ADDRESSES_TO_CLAIM.length);
  if(ADDRESSES_TO_CLAIM.length>0)
  {
    for(i = 0; i < ADDRESSES_TO_CLAIM.length; ++i)
    {
      //console.log("Current address for claiming is:" + ADDRESSES_TO_CLAIM[i] + " ALL KNOWN_ADDRESSES are:")
      //console.log(KNOWN_ADDRESSES)
      var idToTransfer = -1;
      for(ka = 0; ka < KNOWN_ADDRESSES.length; ++ka)
      	if(KNOWN_ADDRESSES[ka].addressBase58 == ADDRESSES_TO_CLAIM[i])
    		    idToTransfer = ka;

      if (idToTransfer > -1)
      {
            if(KNOWN_ADDRESSES[idToTransfer].type === "multisig")
	    {
		jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToTransfer);
		//Multi-sig address
		createMultiSigClaimingTransaction(KNOWN_ADDRESSES[idToTransfer].verificationScript,jsonArrayWithPrivKeys,getCurrentNetworkNickname());
	    }else //not multisig- normal address
	  	createClaimGasTX(KNOWN_ADDRESSES[idToTransfer].addressBase58, KNOWN_ADDRESSES[idToTransfer].pKeyWif, BASE_PATH_CLI, getCurrentNetworkNickname());
      }
    }
  }
}

function getAddressClaimableOrUnclaimed(result,flagClaimable)
{
    var amountClaimable = 0;
    if(result.unclaimed)
      amountClaimable = result.unclaimed;

    if(flagClaimable == true)
    {
      //console.log("amountClaimable inside getAddressClaimableOrUnclaimed is " +  amountClaimable + " of "+ result.address);
      indexInsideAddressToClaim = ADDRESSES_TO_CLAIM.indexOf(result.address);
      if(amountClaimable>0)
      {
	       if ( indexInsideAddressToClaim == -1)
	        ADDRESSES_TO_CLAIM.push(result.address);
  //console.log("addresses pending claim are " + ADDRESSES_TO_CLAIM)
       }else
       {
	        if (indexInsideAddressToClaim != -1)
	         ADDRESSES_TO_CLAIM.splice(indexInsideAddressToClaim, 1);
       }
    }

    return amountClaimable;
}

function callClaimableNeonQuery(adddressToGet,boxToFill="")
{
  url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_claimable/" + adddressToGet;
  $.getJSON(url_toFill, function(result) {
      claimableValues = getAddressClaimableOrUnclaimed(result,true);
      if(boxToFill!="")
	       $(boxToFill).val(claimableValues);

      return claimableValues;
  });
}

function callUnclaimedNeonQuery(adddressToGet,boxToFill="")
{
  url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_unclaimed/" + adddressToGet;
  $.getJSON(url_toFill, function(result) {
    unclaimableValues = getAddressClaimableOrUnclaimed(result,false);
    if(boxToFill!="")
      $(boxToFill).val(unclaimableValues);

    return unclaimableValues;
  });
}


function getAllNeoOrGasFrom(adddressToGet, assetToGet,boxToFill="", automaticTransfer = false, to = "")
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
			 if(KNOWN_ADDRESSES[idToTransfer].type === "multisig")
			 {
				jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToTransfer);
				//Multi-sig address
				neoToSend = 0;
				gasToSend = 0;
			        if(assetToGet == "NEO")
					neoToSend = result.balance[i].amount;
				else
					gasToSend = result.balance[i].amount;
				createMultiSigSendingTransaction(KNOWN_ADDRESSES[idToTransfer].verificationScript,jsonArrayWithPrivKeys, to, neoToSend, gasToSend, getCurrentNetworkNickname());
			 }else
			 	CreateTx(KNOWN_ADDRESSES[idToTransfer].addressBase58,KNOWN_ADDRESSES[idToTransfer].pKeyWif,to, result.balance[i].amount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
		}


	      }
    	  }
       }
    }


  });
}

function fillAllNeo()
{
  var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
  getAllNeoOrGasFrom(KNOWN_ADDRESSES[addrFromIndex].addressBase58,"NEO","#createtx_NEO");
}

function fillAllGas()
{
  var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
  getAllNeoOrGasFrom(KNOWN_ADDRESSES[addrFromIndex].addressBase58,"GAS","#createtx_GAS");
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

    for(ka = 0; ka < KNOWN_ADDRESSES.length; ++ka)
    {
      if(KNOWN_ADDRESSES[ka].print == true)
      {
	      addressToGet = KNOWN_ADDRESSES[ka].addressBase58;
	      //walletIndex = searchAddrIndexFromBase58(addressToGet);
	      getAllNeoOrGasFrom(addressToGet,"NEO","#walletNeo" + ka);
	      getAllNeoOrGasFrom(addressToGet,"GAS","#walletGas" + ka);
	      callClaimableNeonQuery(addressToGet,"#walletClaim" + ka);
	      callUnclaimedNeonQuery(addressToGet,"#walletUnclaim" + ka);
      }
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

  for (i = 0; i < KNOWN_ADDRESSES.length; i++) {
  if(KNOWN_ADDRESSES[i].print == true)
  {
      var txRow = table.insertRow(-1);
      //row.insertCell(-1).appendChild(document.createTextNode(i));
      //Insert button that remove rule
      var b = document.createElement('button');
      b.setAttribute('content', 'test content');
      b.setAttribute('class', 'btn btn-danger');
      b.setAttribute('value', i);
      //b.onclick = function () {buttonRemoveRule();};
      //b.onclick = function () {alert(this.value);};
      b.onclick = function () {buttonKnownAddress(this.value);};
      b.innerHTML = i;
      txRow.insertCell(-1).appendChild(b);

      var addressBase58 = document.createElement("a");
      var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + KNOWN_ADDRESSES[i].addressBase58;
      addressBase58.text = KNOWN_ADDRESSES[i].addressBase58.slice(0,5) + "..." + KNOWN_ADDRESSES[i].addressBase58.slice(-5);
      addressBase58.href = urlToGet;
      addressBase58.target = 'popup';
      addressBase58.onclick= urlToGet;
      addressBase58.style.width = '70px';
      addressBase58.style.display = 'block';
      txRow.insertCell(-1).appendChild(addressBase58);

      var walletNeo = document.createElement('input');
      walletNeo.setAttribute('id', "walletNeo"+i);
      walletNeo.setAttribute("value", "-");
      walletNeo.setAttribute("readonly","true");
      walletNeo.style.width = '90px'
      txRow.insertCell(-1).appendChild(walletNeo);

      var walletGas = document.createElement('input');
      walletGas.setAttribute('id', "walletGas"+i);
      walletGas.setAttribute("value", "-");
      walletGas.setAttribute("readonly","true");
      walletGas.style.width = '80px'
      txRow.insertCell(-1).appendChild(walletGas);

      var walletClaim = document.createElement('input');
      walletClaim.setAttribute('id', "walletClaim"+i);
      walletClaim.setAttribute("value", "-");
      walletClaim.setAttribute("readonly","true");
      walletClaim.style.width = '80px'
      txRow.insertCell(-1).appendChild(walletClaim);

      var b = document.createElement('button');
      b.setAttribute('content', 'test content');
      b.setAttribute('class', 'btn btn-warning');
      b.setAttribute('value', i);
      b.onclick = function () {selfTransfer(this.value);};
      b.innerHTML = '<-';

      txRow.insertCell(-1).appendChild(b);

      var walletUnclaim = document.createElement('input');
      walletUnclaim.setAttribute('id', "walletUnclaim"+i);
      walletUnclaim.setAttribute("value", "-");
      walletUnclaim.setAttribute("readonly","true");
      walletUnclaim.style.width = '80px'
      txRow.insertCell(-1).appendChild(walletUnclaim);
      //Check activation status
   }
  }//Finishes loop that draws each relayed transaction

  document.getElementById("divWalletsStatus").appendChild(table);
}//Finishe DrawWallets function
//===============================================================

//===============================================================
//================ ADD NEW ADDRESS ==============================
//TODO Add suport for adding multisig and specialSC
function addWallet(){
   	//console.log("addWallet()");
        addressBase58ToAdd = document.getElementById('addressToAddBox').value;
        wifToAdd = document.getElementById('wifToAddBox').value;
        vsToAdd = document.getElementById('vsToAddBox').value;

	if(!$("#cbx_multisig")[0].checked)
	{
		console.log("pubAddressToAdd: '" + addressBase58ToAdd + "' wifToAdd: '" + wifToAdd + "'");

	 	if(!Neon.default.is.wif(wifToAdd) && wifToAdd!='')
		{
			alert("This WIF " + wifToAdd + " does not seems to be valid.");
			return;
		}
	   	console.log("wif " + wifToAdd + " is ok!");

		//TODO Check if addressBase58 already exists by getting it from wif
		if(searchAddrIndexFromBase58(addressBase58ToAdd) != -1)
		{
			alert("Public addressBase58 already registered. Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.");
			return;
		}

		//console.log(getWifIfKnownAddress(wifToAdd));
		if(wifToAdd == '' && !$("#cbx_watchonly")[0].checked)
		{
			alert("WIF is null. Please mark WatchOnly or multisig");
			return;
		}

		if(searchAddrIndexFromWif(wifToAdd) != -1 && !$("#cbx_watchonly")[0].checked)
		{
			alert("WIF already registered. Please, delete index " + searchAddrIndexFromWif(wifToAdd) + " first.");
			return;
		}

		
	 	if(!Neon.default.is.address(addressBase58ToAdd) && addressBase58ToAdd!='')
		{
			alert("Public addressBase58 " + addressBase58ToAdd + " is not being recognized as a valid address.");
			return;
		}
	   	console.log("Address " + addressBase58ToAdd + " is ok!");


		KNOWN_ADDRESSES.push({ type: 'commonAddress', addressBase58: addressBase58ToAdd, pKeyWif: wifToAdd, privKey: '', pubKey: '', print: true, verificationScript: '' });
	}

	if($("#cbx_multisig")[0].checked)
	{
		if(vsToAdd == '')
		{
			alert("Verification script is empty for this multisig!");
			return;
		}

		addressBase58ToAdd = toBase58(getScriptHashFromAVM(vsToAdd));

		if(searchAddrIndexFromBase58(addressBase58ToAdd) != -1)
		{
			alert("Public addressBase58 already registered for this MultiSig. Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.");
			return;
		}
		KNOWN_ADDRESSES.push({ type: 'multisig', addressBase58: addressBase58ToAdd, pKeyWif: '', privKey: '', pubKey: '', print: true, verificationScript: vsToAdd, owners: '' });
	}
	
	updateAddressSelectionBox();
   	//console.log("will populate all wallets");
	populateAllWalletData();
}
//===============================================================

//===============================================================
//============= FUNCTION CALLED WHEN SELECTION BOX CHANGES ======
function changeWalletInfo(){
	var wToChangeIndex = $("#wallet_info")[0].selectedOptions[0].index;
	document.getElementById("walletInfoAddressBase58").value = KNOWN_ADDRESSES[wToChangeIndex].addressBase58;
	document.getElementById("walletInfoPubKey").value = KNOWN_ADDRESSES[wToChangeIndex].pubKey;
	document.getElementById("walletInfoWIF").value = KNOWN_ADDRESSES[wToChangeIndex].pKeyWif;
	document.getElementById("walletInfoPrivateKey").value = KNOWN_ADDRESSES[wToChangeIndex].privKey;
	document.getElementById("addressPrintInfo").value = KNOWN_ADDRESSES[wToChangeIndex].print;
	document.getElementById("addressVerificationScript").value = KNOWN_ADDRESSES[wToChangeIndex].verificationScript;
	document.getElementById("addressOwners").value = JSON.stringify(KNOWN_ADDRESSES[wToChangeIndex].owners);
}
//===============================================================

//===============================================================
//============= UPDATE ALL KNOWN ADDRESSES ======================
function updateInfoOfAllKnownAdresses(){
          for(ka = 0; ka < KNOWN_ADDRESSES.length; ++ka)
	  {
         	if(KNOWN_ADDRESSES[ka].type === 'commonAddress')
		{
	            if(KNOWN_ADDRESSES[ka].privKey === '' && Neon.default.is.wif(KNOWN_ADDRESSES[ka].pKeyWif))
			KNOWN_ADDRESSES[ka].privKey = Neon.default.get.privateKeyFromWIF(KNOWN_ADDRESSES[ka].pKeyWif);

	            if(Neon.default.is.privateKey(KNOWN_ADDRESSES[ka].privKey) && KNOWN_ADDRESSES[ka].pubKey === '')
			KNOWN_ADDRESSES[ka].pubKey = Neon.default.get.publicKeyFromPrivateKey(KNOWN_ADDRESSES[ka].privKey);

	            if(KNOWN_ADDRESSES[ka].verificationScript === '')
			KNOWN_ADDRESSES[ka].verificationScript = "21" + KNOWN_ADDRESSES[ka].pubKey + "ac";

	            if(KNOWN_ADDRESSES[ka].addressBase58 === '')
			KNOWN_ADDRESSES[ka].addressBase58 = toBase58(getScriptHashFromAVM(KNOWN_ADDRESSES[ka].verificationScript));
		}

         	if(KNOWN_ADDRESSES[ka].type === 'multisig')
		{
		    if(KNOWN_ADDRESSES[ka].addressBase58 === '')
			KNOWN_ADDRESSES[ka].addressBase58 = toBase58(getScriptHashFromAVM(KNOWN_ADDRESSES[ka].verificationScript));

		    if(KNOWN_ADDRESSES[ka].owners === '')
		    	KNOWN_ADDRESSES[ka].owners = getAddressBase58FromMultiSig(KNOWN_ADDRESSES[ka].verificationScript);
		    //console.log(KNOWN_ADDRESSES[ka].owners);
		}
          }
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function updateAddressSelectionBox(){
      updateInfoOfAllKnownAdresses();
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
          document.getElementById(walletSelectionBox).options.length = 0;
          for(ka = 0; ka < KNOWN_ADDRESSES.length; ++ka)
            addOptionToSelectionBox(KNOWN_ADDRESSES[ka].addressBase58.slice(0,3) + "..." + KNOWN_ADDRESSES[ka].addressBase58.slice(-3),"wallet_"+ka,walletSelectionBox);
}
//===============================================================


//===============================================================
function buttonKnownAddress(idToRemove){
  if(idToRemove < KNOWN_ADDRESSES.length && idToRemove > -1)
  {
      KNOWN_ADDRESSES.splice(idToRemove, 1);
      drawWalletsStatus();
      updateAddressSelectionBox();
  }else{
      alert("Cannot remove TX with ID " + idToRemove + " from set of known addresses with size " + KNOWN_ADDRESSES.length)
  }
}
//===============================================================
function selfTransfer(idToTransfer){
  if(idToTransfer < KNOWN_ADDRESSES.length && idToTransfer > -1)
  {
      	getAllNeoOrGasFrom(KNOWN_ADDRESSES[idToTransfer].addressBase58,"NEO","",true);
  }else{
        alert("Cannot transfer anything from " + idToTransfer + " from set of known addresses with size " + KNOWN_ADDRESSES.length)
  }
}
