function InvokeFromAccount(idToInvoke, mynetfee, mysysgasfee, neo, gas, contract_scripthash, contract_operation, nodeToCall, networkToCall, neonJSParams) {
    console.log("Invoke '" + contract_scripthash + "' function '" + contract_operation + "' with params '" + neonJSParams + "'");
    console.log("mynetfee '" + mynetfee + " mygasfee '" + mysysgasfee + "' neo '" + neo + "' gas '" + gas + "'");
    setNeonApiProvider(networkToCall);

    //Notify user if contract exists
    getContractState(contract_scripthash, false);

    if (contract_scripthash == "" || !Neon.default.is.scriptHash(contract_scripthash)) {
        alert("Contract scripthash " + contract_scripthash + " is not being recognized as a scripthash.");
        return;
    }
    if ($("#contracthashjs")[0].value == "") {
        console.log("(INVOKE) selection box hash is empty, all selection boxes are going to be fullfilled based on the contract_scripthash passed as parameter");
        updateScriptHashesBoxes(contract_scripthash);
    }

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
        let transaction = new Neon.tx.InvocationTransaction({
            gas: mysysgasfee
        });
        if (neo > 0)
            transaction.addIntent("NEO", neo, toBase58(contract_scripthash));
        if (gas > 0)
            transaction.addIntent("GAS", gas, toBase58(contract_scripthash));

        transaction.script = myscript;
        transaction.calculate(balance, null, mynetfee);

        return transaction;
    });

    // Advanced signing should only forward transaction attributes to textbox
    if ($("#cbxAdvSignToggle")[0].checked) {
        PendingTX = constructTx;
        PendingTX.then(transaction => {
            $("#tx_AdvancedSigning_ScriptHash").val(transaction.hash);
            $("#txScript_advanced_signing").val(transaction.serialize(false));
            $("#tx_AdvancedSigning_Size").val(transaction.serialize(true).length / 2);
            $("#tx_AdvancedSigning_HeaderSize").val(transaction.serialize(false).length / 2);
        });
    } else {
        console.log("Signing...");
        const signedTx = signTXWithSingleSigner(ECO_WALLET[idToInvoke].account, constructTx);

        console.log("Sending...");
        var txHash;
        const sendTx = signedTx
            .then(transaction => {
                txHash = transaction.hash;
                const client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
                return client.sendRawTransaction(transaction.serialize(true));
            })
            .then(res => {
                //console.log("\n\n--- Response ---");
                //console.log(res);
                if (res) {
                    var invokeParams = transformInvokeParams(ECO_WALLET[idToInvoke].account.address, mynetfee, mysysgasfee, neo, gas, neonJSParams);
                    updateVecRelayedTXsAndDraw(txHash, "Invoke", contract_scripthash, invokeParams);

                    // Jump to acitivy tab and record last tab
                    $('.nav-pills a[data-target="#activity"]').tab('show');
                    LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";
                    document.getElementById('divNetworkRelayed').scrollIntoView();

                    createNotificationOrAlert("InvocationTransaction_Invoke", "Response: " + res + " ScriptHash: " + contract_scripthash + " tx_hash: " + txHash, 7000);
                }
            })
            .catch(err => {
                console.log(err);
                createNotificationOrAlert("InvocationTransaction_Invoke ERROR", "Response: " + err, 7000);
            })
    }
}

// Example of invoke
// InvokeFromAccount(0,0,3,1,1, "24f232ce7c5ff91b9b9384e32f4fd5038742952f", "operation", BASE_PATH_CLI, getCurrentNetworkNickname(), [])
// contract_operation IS OBSOLET AS IT IS RIGHT NOW
function InvokeFromAccountOld(idToInvoke, mynetfee, mysysgasfee, neo, gas, contract_scripthash, contract_operation, nodeToCall, networkToCall, neonJSParams) {
    console.log("Invoke '" + contract_scripthash + "' function '" + contract_operation + "' with params '" + neonJSParams + "'");
    console.log("mynetfee '" + mynetfee + " mygasfee '" + mysysgasfee + "' neo '" + neo + "' gas '" + gas + "'");

    var i = 0;
    for (i = 0; i < neonJSParams.length; i++)
        console.log(JSON.stringify(neonJSParams[i]));

    //Notify user if contract exists
    getContractState(contract_scripthash, false);

    if (contract_scripthash == "" || !Neon.default.is.scriptHash(contract_scripthash)) {
        alert("Contract scripthash " + contract_scripthash + " is not being recognized as a scripthash.");
        return;
    }
    if ($("#contracthashjs")[0].value == "") {
        console.log("(INVOKE) selection box hash is empty, all selection boxes are going to be fullfilled based on the contract_scripthash passed as parameter");
        updateScriptHashesBoxes(contract_scripthash);
    }

    var intent = createGasAndNeoIntent(toBase58(contract_scripthash), neo, gas);
    //console.log(intent);

    /*
       export const createScript = (...scriptIntents) => {
      if (scriptIntents.length === 1 && Array.isArray(scriptIntents[0])) {
        scriptIntents = scriptIntents[0]
      }
      const sb = new ScriptBuilder()
      for (var scriptIntent of scriptIntents) {
        if (!scriptIntent.scriptHash) throw new Error('No scriptHash found!')
        const { scriptHash, operation, args, useTailCall } = Object.assign({ operation: null, args: undefined, useTailCall: false }, scriptIntent)

        sb.emitAppCall(scriptHash, operation, args, useTailCall)
      }
      return sb.str
    }

    emitAppCall (scriptHash, operation = null, args = undefined, useTailCall = false) {
      this.emitPush(args)
      if (operation) {
        let hexOp = ''
        for (let i = 0; i < operation.length; i++) {
          hexOp += num2hexstring(operation.charCodeAt(i))
        }
        this.emitPush(hexOp)
      }
      this._emitAppCall(scriptHash, useTailCall)
      return this
    }
    */

    var sb = Neon.default.create.scriptBuilder(); //new ScriptBuilder();
    var i = 0;
    // PUSH parameters BACKWARDS!!
    for (i = neonJSParams.length - 1; i >= 0; i--) {
        console.log('emit push:' + JSON.stringify(neonJSParams[i]));
        console.log(neonJSParams[i]);
        if (Array.isArray(neonJSParams[i])) {
            console.log("is array!");
            //sb._emitArray(neonJSParams[i]);
        }
        //else
        //      sb.emitPush(neonJSParams[i]);
        sb._emitParam(neonJSParams[i]);
    }
    sb._emitAppCall(contract_scripthash, false); // tailCall = false
    var myscript = sb.str;

    // TODO: consider "in array" option to create an array of parameters...
    // Json should be something like: [{"type":"String","value":"op"},[{"type":"String","value":"ccxxcx"},{"type":"String","value":"sddsdd"}]]
    // Or: [{"type":"String","value":"op"},{"type":"Array", "value": [{"type":"String","value":"ccxxcx"},{"type":"String","value":"sddsdd"}]}]

    setNeonApiProvider(networkToCall);
    const config = {
        api: NEON_API_PROVIDER,
        url: nodeToCall,
        //script: Neon.default.create.script({
        //   scriptHash: contract_scripthash,
        //   operation: contract_operation,
        //   args: neonJSParams
        // }),
        script: myscript, // new manual script respecting each parameter
        intents: intent,
        account: ECO_WALLET[idToInvoke].account, // This is the address which the assets come from
        fees: mynetfee, // net fees
        gas: mysysgasfee // systemfee
    }
    console.log(config);
    Neon.default.doInvoke(config).then(res => {
        if (res.response.result) {
            console.log(res);
            var invokeParams = transformInvokeParams(ECO_WALLET[idToInvoke].account.address, mynetfee, mysysgasfee, neo, gas, neonJSParams);
            updateVecRelayedTXsAndDraw(res.response.txid, "Invoke", contract_scripthash, invokeParams);

            // Jump to acitivy tab and record last tab
            $('.nav-pills a[data-target="#activity"]').tab('show');
            LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";
            document.getElementById('divNetworkRelayed').scrollIntoView();

            createNotificationOrAlert("InvocationTransaction_Invoke", "Response: " + res.response.result + " ScriptHash: " + contract_scripthash + " tx_hash: " + res.tx.hash, 7000);
        }
    }).catch(err => {
        console.log(err);
        createNotificationOrAlert("InvocationTransaction_Invoke ERROR", "Response: " + err, 7000);
    });
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
        .emitPush(storage) // storage: {none: 0x00, storage: 0x01, dynamic: 0x02, storage+dynamic:0x03}
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
        if (res.response.result) {
            var deployParams = transformDeployParams(ECO_WALLET[idToDeploy].account.address, mynetfee, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname);
            updateVecRelayedTXsAndDraw(res.response.txid, "Deploy", $("#contracthashjs").val(), deployParams);

            // Jump to acitivy tab and record last tab
            $('.nav-pills a[data-target="#activity"]').tab('show');
            LAST_ACTIVE_TAB_BEFORE_ACTIVITY = "network";
            document.getElementById('divNetworkRelayed').scrollIntoView();

            createNotificationOrAlert("InvocationTransaction_Deploy", "Response: " + res.response.result + " tx_hash: " + res.tx.hash, 7000);
        }
    }).catch(err => {
        console.log(err);
        createNotificationOrAlert("InvocationTransaction_Deploy ERROR", "Response: " + err, 5000);
    }); //end doInvoke
} // end deploy from acount

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

function transformInvokeParams(myaddress, mynetfee, mysysgasfee, neo, gas, neonJSParams) {
    var invokeParams = {
        caller: myaddress,
        mynetfee: mynetfee,
        mysysgasfee: mysysgasfee,
        neo: neo,
        gas: gas,
        neonJSParams: neonJSParams
    }
    return JSON.stringify(invokeParams);
}

function transformDeployParams(myaddress, mynetfee, contract_script, storage, returntype, par, contract_description, contract_email, contract_author, contract_version, contract_appname) {
    var deployParams = {
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
        contract_appname: contract_appname
    }
    return JSON.stringify(deployParams);
}


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
