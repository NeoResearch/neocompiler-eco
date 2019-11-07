function providerInvoke(networkToCall, contract_scripthash, neo, gas, mynetfee, neonJSParams){
	checkProviderNetwork(networkToCall);
	const argConversion = {
		7:'String' ,
		2:'Integer',
		16:'Array',
		5:'ByteArray',
		//5:'Address'
		//1:'Boolean',
		//3:'Hash160',
		//4:'Hash256',
	}
	let tx = {
		scriptHash: contract_scripthash,
		operation: '',
		args: [],
		attachedAssets: {
			NEO: String(neo),
			GAS: String(gas)
		},
		fee: String(mynetfee),
		broadcastOverride: false,
		network: networkToCall
	}
	if(neonJSParams.length>0){
		if(neonJSParams[0].type==7){
			tx.operation=neonJSParams.shift().value;
		}
		if(neonJSParams.length>0 && neonJSParams[0].type==16){
			for(let i=0; i<neonJSParams[0].length; i++){
				tx.args.push({
					type: argConversion[neonJSParams[0][i].type],
					value: neonJSParams[0][i].value
				});
			}
		}
	}
	return window.provider.invoke(tx)
		.then(res => {
			handleInvoke(res, res.txid, tx, contract_scripthash);
		})
		.catch(handleErrorInvoke);
}

function InvokeFromAccount(idToInvoke, mynetfee, mysysgasfee, neo, gas, contract_scripthash, contract_operation, nodeToCall, networkToCall, neonJSParams) {
    console.log("Invoke '" + contract_scripthash + "' function '" + contract_operation + "' with params '" + neonJSParams + "'");
    console.log("mynetfee '" + mynetfee + " mygasfee '" + mysysgasfee + "' neo '" + neo + "' gas '" + gas + "'");

    if (contract_scripthash == "" || !Neon.default.is.scriptHash(contract_scripthash)) {
        alert("Contract scripthash " + contract_scripthash + " is not being recognized as a scripthash.");
        return;
    }
    if ($("#contracthashjs")[0].value == "") {
        console.log("(INVOKE) selection box hash is empty, all selection boxes are going to be fullfilled based on the contract_scripthash passed as parameter");
        updateScriptHashesBoxes(contract_scripthash);
    }

	if($("#ecolabproviderselection").val() !== "NeoCompiler-Eco") {
		return providerInvoke(networkToCall, contract_scripthash, neo, gas, mynetfee, neonJSParams);
    }

    setNeonApiProvider(networkToCall);

    //Notify user if contract exists
    getContractState(contract_scripthash, false);


    // ================================================================================
    // automatic claim
    var availableGAS = Number($("#walletGas"+idToInvoke)[0].innerHTML);
    var availableClaim = Number($("#walletUnclaim"+idToInvoke).val());
    var totalGasNeeded = mynetfee+mysysgasfee+gas;
    if( totalGasNeeded > availableGAS)
    {
       // needs more than availableGAS, will try to claim
      
	    console.log("availableGAS: "+ availableGAS + "\t availableClaim:" + availableClaim + " - totalGasNeeded:" + totalGasNeeded);
	    if( totalGasNeeded >= (availableGAS + availableClaim))
	    {
      		console.log("Self transfer activated. Required amount of GAS will be claimed!");
      		createNotificationOrAlert("InvocationTransaction_Invoke", "Self transfer activated. Required amount of GAS will be claimed!", 7000);
      		selfTransfer(idToInvoke);
      		return;
	    }
       else
	    {
      		console.error("No GAS for this transfer, even if claiming!");
      		return;
	    }
    }
    // ================================================================================

    var intent = createGasAndNeoIntent(toBase58(contract_scripthash), neo, gas);

    for (var i = 0; i < neonJSParams.length; i++)
        console.log(JSON.stringify(neonJSParams[i]));
    var sb = Neon.default.create.scriptBuilder(); //new ScriptBuilder();
    // PUSH parameters BACKWARDS!!
    for (var i = neonJSParams.length - 1; i >= 0; i--)
        sb._emitParam(neonJSParams[i]);
    sb._emitAppCall(contract_scripthash, false); // tailCall = false
    var myscript = sb.str;

    var constructTx = NEON_API_PROVIDER.getBalance(ECO_WALLET[idToInvoke].account.address).then(balance => {
        // Create invocation transaction with desired systemgas (param gas)
        let transaction = new Neon.tx.InvocationTransaction({
            gas: mysysgasfee
        });

        // Attach intents
        if (neo > 0)
            transaction.addIntent("NEO", neo, toBase58(contract_scripthash));
        if (gas > 0)
            transaction.addIntent("GAS", gas, toBase58(contract_scripthash));

        // addint invocation script
        transaction.script = myscript;

        // Attach extra network fee when calculating inputs and outputs
        transaction.calculate(balance, null, mynetfee);

        return transaction;
    });

    var invokeParams = transformInvokeParams(ECO_WALLET[idToInvoke].account.address, mynetfee, mysysgasfee, neo, gas, neonJSParams, contract_scripthash);
    console.log(invokeParams);
    console.log(invokeParams.contract_scripthash);
    // Advanced signing should only forward transaction attributes to textbox
    if ($("#cbxAdvSignToggle")[0].checked) {
        PendingTX = constructTx;
        PendingTXParams = invokeParams;
        PendingTX.then(transaction => {
            $("#tx_AdvancedSigning_ScriptHash").val(transaction.hash);
            $("#txScript_advanced_signing").val(transaction.serialize(false));
            $("#tx_AdvancedSigning_Size").val(transaction.serialize(true).length / 2);
            $("#tx_AdvancedSigning_HeaderSize").val(transaction.serialize(false).length / 2);
        });
    } else {
        console.log("Invoke Signing...");
        const signedTx = signTXWithSingleSigner(ECO_WALLET[idToInvoke].account, constructTx);

        console.log("Invoke Sending...");
        var txHash;
        const sendTx = signedTx
            .then(transaction => {
                txHash = transaction.hash;
                const client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
                return client.sendRawTransaction(transaction.serialize(true));
            })
            .then(res => {
				handleInvoke(res, txHash, invokeParams, contract_scripthash);
            })
            .catch(handleErrorInvoke);
    }
}

function handleInvoke(res, txHash, invokeParams, contract_scripthash){
	if (res && !DISABLE_ACTIVITY_HISTORY) {
		updateVecRelayedTXsAndDraw(txHash, JSON.stringify(invokeParams));

		// Jump to acitivy tab and record last tab
		$('.nav-pills a[data-target="#activity"]').tab('show');
		LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";
		document.getElementById('divNetworkRelayed').scrollIntoView();

		createNotificationOrAlert("InvocationTransaction_Invoke", "Response: " + res + " ScriptHash: " + contract_scripthash + " tx_hash: " + txHash, 7000);
	}
}

function handleErrorInvoke(err){
	console.log(err);
	createNotificationOrAlert("InvocationTransaction_Invoke ERROR", "Response: " + err, 7000);
}

function providerDeploy(mynetfee, networkToCall, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname){
	checkProviderNetwork(networkToCall);
	return window.provider.deploy({
		name: contract_appname,
		version: contract_version,
		author: contract_author,
		email: contract_email,
		description: contract_description,
		needsStorage: Boolean(storage & 0x01),
		dynamicInvoke: Boolean(storage & 0x02),
		isPayable: Boolean(storage & 0x04),
		parameterList: par,
		returnType: returntype,
		code: contract_script,
		networkFee: String(mynetfee),
		network: networkToCall
	})
		.then((res) => {
			if (res && !DISABLE_ACTIVITY_HISTORY) {
				window.provider.getAccount()
					.then(account => {
						handleDeploy(account.address, mynetfee, contract_scripthash, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname, res.txid, "Success");
					});
			}
		})
		.catch(handleDeployError);
}

// Examples of Deploy
// DeployFromAccount(0,0.0000001,90,BASE_PATH_CLI, getCurrentNetworkNickname(),script,false,01,'')
// DeployFromAccount(0,0.001,490,BASE_PATH_CLI, getCurrentNetworkNickname(),'00c56b611423ba2703c53263e8d6e522dc32203339dcd8eee96168184e656f2e52756e74696d652e436865636b5769746e65737364320051c576000f4f574e45522069732063616c6c6572c46168124e656f2e52756e74696d652e4e6f7469667951616c756600616c7566', false,01,'')
function DeployFromAccount(idToDeploy, mynetfee, mysysgasfee, nodeToCall, networkToCall, contract_script, storage = 0x00, returntype = '05', par = '', contract_description = 'appdescription', contract_email = 'email', contract_author = 'author', contract_version = 'v1.0', contract_appname = 'appname') {
    console.log("current gas fee is " + mysysgasfee);

    if (returntype.length == 1)
        returntype = returntype[0]; // remove array if single element

    if (contract_script == "") {
        alert("ERROR (DEPLOY): Empty script (avm)!");
        return;
    }

    var contract_scripthash = getScriptHashFromAVM(contract_script);

    //Notify user if contract exists
    //getContractState(contract_scripthash, true);

    if (contract_scripthash == "" || !Neon.default.is.scriptHash(contract_scripthash)) {
        alert("ERROR (DEPLOY): Contract scripthash " + contract_scripthash + " is not being recognized as a scripthash.");
        return;
    }

	if($("#ecolabproviderselection").val() !== "NeoCompiler-Eco") {
		return providerDeploy(mynetfee, networkToCall, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname);
	}

    // ================================================================================
    // automatic claim
    var availableGAS = Number($("#walletGas"+idToDeploy)[0].innerHTML);
    var availableClaim = Number($("#walletUnclaim"+idToDeploy).val());
    var totalGasNeeded = mynetfee+mysysgasfee;
    if( totalGasNeeded > availableGAS)
    {
	    console.log("availableGAS: "+ availableGAS + "\t availableClaim:" + availableClaim + " - totalGasNeeded:" + totalGasNeeded);
	    if( totalGasNeeded <= (availableGAS + availableClaim))
	    {
		console.log("Self transfer activated. Required amount of GAS will be claimed!");
		createNotificationOrAlert("InvocationTransaction_Deploy", "Self transfer activated. Required amount of GAS will be claimed!", 7000);
		selfTransfer(idToDeploy);
		return;
	    }else
	    {
		console.error("No GAS for this transfer, even if claiming!");
		return;
	    }
    }
    // ================================================================================

    // for Deploy we should ensure that AVM Script to be deployed has the same contract_scripthash of the boxes (in order to ensure correctly full of activity parameters)
    if ($("#contracthashjs")[0].value == "" || $("#contracthashjs")[0].value != contract_scripthash) {
        console.log("(DEPLOY) contracthash on boxes are empty of different, they are going to be fullfilled based on the current AVM loaded to be deployed!");
        updateScriptHashesBoxes(contract_scripthash);
    }

    const sb = Neon.default.create.scriptBuilder();
    sb.emitPush(Neon.u.str2hexstring(contract_description)) // description
        .emitPush(Neon.u.str2hexstring(contract_email)) // email
        .emitPush(Neon.u.str2hexstring(contract_author)) // author
        .emitPush(Neon.u.str2hexstring(contract_version)) // code_version
        .emitPush(Neon.u.str2hexstring(contract_appname)) // name
        .emitPush(storage) // storage: {none: 0x00, storage: 0x01, dynamic: 0x02, storage+dynamic:0x03}, if the third bit is set => payable
        .emitPush(returntype) // expects hexstring  (_emitString) // usually '05'
        .emitPush(par) // expects hexstring  (_emitString) // usually '0710'
        .emitPush(contract_script) //script
        .emitSysCall('Neo.Contract.Create');

    setNeonApiProvider(networkToCall);
    const config = {
        api: NEON_API_PROVIDER,
        url: nodeToCall,
        account: ECO_WALLET[idToDeploy].account,
        script: sb.str,
        fees: mynetfee,
        gas: mysysgasfee
    }

    // Do invoke for Deploy
    Neon.default.doInvoke(config).then(res => {
        if (res.response.result && !DISABLE_ACTIVITY_HISTORY) {
			handleDeploy(ECO_WALLET[idToDeploy].account.address, mynetfee, contract_scripthash, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname, res.response.txid, res.response.result);
        }
    }).catch(handleDeployError); //end doInvoke
} // end deploy from acount

function checkProviderNetwork(networkToCall){
	if (networkToCall !== "MainNet" && networkToCall !== "TestNet"){
		alert("ERROR (DEPLOY): Only MainNet and TestNet are supported by wallet providers.");
		throw "ERROR (DEPLOY): Only MainNet and TestNet are supported by wallet providers.";
	}
}

function handleDeploy(address, mynetfee, contract_scripthash, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname, txid, result){
	var deployParams = transformDeployParams(address, mynetfee, contract_scripthash, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname);
	updateVecRelayedTXsAndDraw(txid, JSON.stringify(deployParams));

	// Jump to acitivy tab and record last tab
	$('.nav-pills a[data-target="#activity"]').tab('show');
	LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";
	document.getElementById('divNetworkRelayed').scrollIntoView();

	createNotificationOrAlert("InvocationTransaction_Deploy", "Response: " + result + " tx_hash: " + txid, 7000);
}

function handleDeployError(err){
	console.log(err);
	createNotificationOrAlert("InvocationTransaction_Deploy ERROR", "Response: " + err, 5000);
}

function pushParams(neonJSParams, type, value) {
    if (type == 'String')
        neonJSParams.push(Neon.default.create.contractParam(type, value));
    else if (type == 'Address')
        neonJSParams.push(Neon.sc.ContractParam.byteArray(value, 'address'));
    else if (type == 'Hex')
        neonJSParams.push(Neon.default.create.contractParam('ByteArray', value));
    else if (type == 'DecFixed8') {
        // Decimal fixed 8 seems to break at transition 92233720368.54775807 -> 92233720368.54775808
        neonJSParams.push(Neon.sc.ContractParam.byteArray(value, 'fixed8'));
    } else if (type == 'Integer') {
        if ((typeof(value) == "string") && (Number(value).toString() != value))
            value = "0"; // imprecision in javascript? // JAVASCRIPT MAXIMUM NUMBER SEEMS TO BE: 9223372036854775000
        if (Number(value) < 0) // neon-js int conversion will fail for negative values: "expected hexstring but found..."
            neonJSParams.push(Neon.default.create.contractParam('ByteArray', negbigint2behex(value)));
        else
            neonJSParams.push(Neon.default.create.contractParam('Integer', Number(value)));
        //console.log("INTEGER="+value+" -> "+Number(value));
    } else if (type == 'Array')
        neonJSParams.push(Neon.default.create.contractParam(type, value));
    else
        alert("You are trying to push a wrong invoke param type: " + type + "with value : " + value);
}

function transformInvokeParams(myaddress, mynetfee, mysysgasfee, neo, gas, neonJSParams, contract_scripthash) {
    var invokeParams = {
        contract_scripthash: contract_scripthash,
        caller: myaddress,
        mynetfee: mynetfee,
        mysysgasfee: mysysgasfee,
        neo: neo,
        gas: gas,
        neonJSParams: neonJSParams,
        type: "invoke"
    }
    return invokeParams;
}

function transformDeployParams(myaddress, mynetfee, contract_scripthash, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname) {
    var deployParams = {
        contract_scripthash: contract_scripthash,
        caller: myaddress,
        mynetfee: mynetfee,
        contract_script: contract_script,
        storage: storage,
        returntype: returntype,
        par: par,
        contract_description: contract_description,
        contract_email: contract_email,
        contract_author: contract_author,
        contract_version: contract_version,
        contract_appname: contract_appname,
        type: "deploy"
    }
    return deployParams;
}



// Example of invoke
// InvokeFromAccount(0,0,3,1,1, "24f232ce7c5ff91b9b9384e32f4fd5038742952f", "operation", BASE_PATH_CLI, getCurrentNetworkNickname(), [])
// contract_operation IS OBSOLET AS IT IS RIGHT NOW

//ICO TEMPLATE EXAMPLE:
/*
//Invoke mintToken from wallet of AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y
Invoke(ECO_WALLET[0].account.address,ECO_WALLET[0].account.WIF,0,10,0, "e096710ef8012b83677b039ec0ee6871868bfcf9", "mintTokens", BASE_PATH_CLI, getCurrentNetworkNickname(), [])

//Check Balance of AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y
{
  "jsonrpc": "2.0",
  "method": "invokefunction",
  "params": [
    "e096710ef8012b83677b039ec0ee6871868bfcf9",
    "balanceOf",
    [
      {
        "type": "Hash160",
        "value": "e9eed8dc39332032dc22e5d6e86332c50327ba23"
      }
    ]
  ],
  "id": 3
}

//Transfer some NEP-5 Tokens from AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y to APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL
var neonJSParams = [];
pushParams(neonJSParams, 'Address', 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y');
pushParams(neonJSParams, 'Address', 'APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL');
pushParams(neonJSParams, 'Integer', "0.5");
Invoke(ECO_WALLET[0].account.address,ECO_WALLET[0].account.WIF,0,0,0, "925705cf2cae08804c51e2feaaa0f0a3c7b77bb9", "Transfer", BASE_PATH_CLI, getCurrentNetworkNickname(), neonJSParams)

//Check Balance of APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL
{
  "jsonrpc": "2.0",
  "method": "invokefunction",
  "params": [
    "e096710ef8012b83677b039ec0ee6871868bfcf9",
    "balanceOf",
    [
      {
        "type": "Hash160",
        "value": "0f2b7a6ee34db32d9151c6028960ab2a8babea52"
      }
    ]
  ],
  "id": 3
}

*/
