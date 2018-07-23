function searchIndexOfAllKnownWallets(addressToTryToGet)
{
  for(iToFind = 0; iToFind < KNOWN_ADDRESSES.length; ++iToFind)
      if(KNOWN_ADDRESSES[iToFind].publicKey == addressToTryToGet)
	     return iToFind;
  return -1;
}

function fillPrivateKeyIfKnown(boxPublicFrom,boxPrivateTo)
{
  //console.log("public is "+ $(boxPublicFrom).val())

  var index = searchIndexOfAllKnownWallets($(boxPublicFrom).val());
  if (index != -1)
      $(boxPrivateTo).val(KNOWN_ADDRESSES[index].privateKey);
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
      var index = -1;
      for(ka = 0; ka < KNOWN_ADDRESSES.length; ++ka)
      	if(KNOWN_ADDRESSES[ka].publicKey == ADDRESSES_TO_CLAIM[i])
    		    index = ka;

      if (index > -1)
  	    CreateClaimGasTX(KNOWN_ADDRESSES[index].publicKey, KNOWN_ADDRESSES[index].privateKey, BASE_PATH_CLI, getCurrentNetworkNickname());
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


function getAllNeoOrGasFrom(adddressToGet,assetToGet,boxToFill="",selfTransfer = false)
{
  var url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + adddressToGet;
  //console.log("url_toFill:" + url_toFill);
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
	      if(selfTransfer)
	      {
		 var idToTransfer = searchIndexOfAllKnownWallets(adddressToGet);
		 if (idToTransfer != -1)
		 	CreateTx(KNOWN_ADDRESSES[idToTransfer].publicKey,KNOWN_ADDRESSES[idToTransfer].privateKey,KNOWN_ADDRESSES[idToTransfer].publicKey, result.balance[i].amount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
	      }      
	
    	      return result.balance[i].amount;
    	  }
       }
    }else
      return 0;
    
  });
}

function fillAllNeo()
{
  getAllNeoOrGasFrom($("#createtx_from").val(),"NEO","#createtx_NEO");
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
    //Adding all known address to NeonInvokeSelectionBox
    addAllKnownAddressesToSelectionBox("wallet_invokejs");
    addAllKnownAddressesToSelectionBox("wallet_deployjs");
    addAllKnownAddressesToSelectionBox("wallet_info");

    drawWalletsStatus();

    for(ka = 0; ka < KNOWN_ADDRESSES.length; ++ka)
    {
      addressToGet = KNOWN_ADDRESSES[ka].publicKey;
      //walletIndex = searchIndexOfAllKnownWallets(addressToGet);
      getAllNeoOrGasFrom(addressToGet,"NEO","#walletNeo" + ka);
      getAllNeoOrGasFrom(addressToGet,"GAS","#walletGas" + ka);
      callClaimableNeonQuery(addressToGet,"#walletClaim" + ka);
      callUnclaimedNeonQuery(addressToGet,"#walletUnclaim" + ka);
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
      var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + KNOWN_ADDRESSES[i].publicKey;
      addressBase58.text = KNOWN_ADDRESSES[i].publicKey.slice(0,5) + "..." + KNOWN_ADDRESSES[i].publicKey.slice(-5);
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
  }//Finishes loop that draws each relayed transaction

  document.getElementById("divWalletsStatus").appendChild(table);
}//Finishe DrawWallets function
//===============================================================

//===============================================================
function addWallet(){
        pubAddressToAdd = document.getElementById('addressToAddBox').value;
        wifToAdd = document.getElementById('wifToAddBox').value;
        //console.log("pubAddressToAdd:" + pubAddressToAdd + " wifToAdd: " + wifToAdd);

	if(searchIndexOfAllKnownWallets(pubAddressToAdd) != -1)
	{
		alert("Public address already registered. Please, delete index " + searchIndexOfAllKnownWallets(pubAddressToAdd) + " first.");
		return;
	}
 	if(!Neon.default.is.address(pubAddressToAdd))
	{
		alert("Public address " + pubAddressToAdd + " is not being recognized as a valid address.");
		return;
	}
	KNOWN_ADDRESSES.push({ publicKey: pubAddressToAdd, privateKey: wifToAdd });

	populateAllWalletData();
}
//===============================================================

//===============================================================
//============= FUNCTION CALLED WHEN SELECTION BOX CHANGES ======
function changeWalletInfo(){
	var wToChangeIndex = $("#wallet_info")[0].selectedOptions[0].index;
	document.getElementById("walletInfoAddressBase58").value = KNOWN_ADDRESSES[wToChangeIndex].publicKey;
	document.getElementById("walletInfoPubKey").value = KNOWN_ADDRESSES[wToChangeIndex].pubKey;
	document.getElementById("walletInfoWIF").value = KNOWN_ADDRESSES[wToChangeIndex].privateKey;
}
//===============================================================


//===============================================================
function buttonKnownAddress(idToRemove){
  if(idToRemove < KNOWN_ADDRESSES.length && idToRemove > -1)
  {
      KNOWN_ADDRESSES.splice(idToRemove, 1);
      drawWalletsStatus();
  }else{
      alert("Cannot remove TX with ID " + idToRemove + " from set of known addresses with size " + KNOWN_ADDRESSES.length)
  }
}
//===============================================================
function selfTransfer(idToTransfer){
  if(idToTransfer < KNOWN_ADDRESSES.length && idToTransfer > -1)
  {
      getAllNeoOrGasFrom(KNOWN_ADDRESSES[idToTransfer].publicKey,"NEO","",true);
  }else{
      alert("Cannot transfer anything from " + idToTransfer + " from set of known addresses with size " + KNOWN_ADDRESSES.length)
  }
}
