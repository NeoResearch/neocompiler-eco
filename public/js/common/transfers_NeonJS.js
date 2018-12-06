function createMultiSigClaimingTransaction(verificationScript,jsonArrayWithPrivKeys,networkToCall){
	addressBase58 = toBase58(getScriptHashFromAVM(verificationScript));
	const config = {
	  api: new Neon.api.neoscan.instance(networkToCall),
	  address: addressBase58
	}

//const account = new wallet.Account(claimingPrivateKey);

console.log("\n\n--- Claiming Address ---");
//console.log(account);

	claimsFrom = Neon.api.getClaimsFrom(config, Neon.api.neoscan)
	claimsFrom.then((c) => Neon.api.createTx(c, 'claim'))
	claimsFrom.then( function(c) {
		c.tx.scripts = [];
		//Everyone signs the invocation in any order
		var invocationScript = '';
		for(nA=0;nA<jsonArrayWithPrivKeys.length;nA++)
			invocationScript = signWithMultiSign(c.tx.serialize(), invocationScript, Neon.wallet.getPrivateKeyFromWIF(jsonArrayWithPrivKeys[nA].account.privateKey));

		invocationScript = sortMultiSigInvocationScript(c.tx.serialize(),invocationScript, verificationScript);
		c.tx.scripts.push({invocationScript: invocationScript, verificationScript: verificationScript});
		const serializedTx = c.tx.serialize();
		console.log(serializedTx);
		sendRawTXToTheRPCNetwork(serializedTx);
	});
}

//==========================================================================
function createGasAndNeoIntent(to, neo, gas){
    var intent;
    if(neo > 0 && gas > 0)
        intent = Neon.api.makeIntent({NEO:neo,GAS:gas}, to)

    if(neo == 0 && gas > 0)
        intent = Neon.api.makeIntent({GAS:gas}, to)

    if(neo > 0 && gas == 0)
        intent = Neon.api.makeIntent({NEO:neo}, to)
    return intent;
}
//==========================================================================

function createTxFromMSAccount(idToTransfer, to, neo, gas, networkToCall){
	jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToTransfer);
	verificationScript = KNOWN_ADDRESSES[idToTransfer].account;

	const neoscanAPIProvider = new Neon.api.neoscan.instance(networkToCall);

	/*
	console.log("Constructing I")
	neoscanAPIProvider.getBalance(KNOWN_ADDRESSES[idToTransfer].account.address).then(balance => {
		let unsignedTx = Neon.default.create.contractTx();
		if(neo > 0)
			unsignedTx.addIntent("NEO",neo,to)
		if(gas > 0)
			unsignedTx.addIntent("GAS",gas,to)
		unsignedTx.calculate(balance)
		console.log(balance)
		const wtx = unsignedTx.serialize();
		
		// ===========================================
		// Sig only with necessary amount of signature
		invocationScriptClean = [];
		var signatures=0;
		for(var nA=0;nA<jsonArrayWithPrivKeys.length - 1;nA++)
		{	
		  	invocationScriptClean = fillWithMultiSign(wtx, invocationScriptClean, Neon.wallet.getPrivateKeyFromWIF(jsonArrayWithPrivKeys[nA].privKey));
			signatures++;
			if(signatures >= KNOWN_ADDRESSES[idToTransfer].account.contract.parameters.length)
				break;
		}
		// ===========================================

		console.log("Creating witness");
		console.log(wtx)
		console.log(invocationScriptClean)
		console.log(verificationScript)
		console.log("Creating witness");
		const multiSigWitness = Neon.tx.Witness.buildMultiSig(
		  wtx,
		  invocationScriptClean,
		  verificationScript
		);
		console.log("ok witness");
		console.log(multiSigWitness)
		unsignedTx.scripts.push(multiSigWitness);
		const signedHex = unsignedTx.serialize();
		console.log(signedHex);
		console.log("serialized");
		sendRawTXToTheRPCNetwork(signedHex);	
	});*/
  

	console.log("Constructing II")

	var constructTx = neoscanAPIProvider.getBalance(KNOWN_ADDRESSES[idToTransfer].account.address).then(balance => {
	    let transaction = Neon.default.create.contractTx();
	    if(neo > 0)
		transaction.addIntent("NEO",neo,to)
	    if(gas > 0)
		transaction.addIntent("GAS",gas,to)
	    transaction.calculate(balance);

	    return transaction;
        });

	console.log("Signing...")

	const signTx = constructTx.then(transaction => {
	  const txHex = transaction.serialize(false);

	  invocationScriptClean = [];
	  var signatures=0;
	  console.log("Here")
	  for(nA=0;nA<jsonArrayWithPrivKeys.length;nA++)
          {
	  	invocationScriptClean = fillSignaturesForMultiSign(txHex, invocationScriptClean, Neon.wallet.getPrivateKeyFromWIF(jsonArrayWithPrivKeys[nA].privKey));
		signatures++;
		//if(signatures >= KNOWN_ADDRESSES[idToTransfer].account.contract.parameters.length)
		//	break;
	  }
	  console.log("ok")
	  const multiSigWitness = Neon.tx.Witness.buildMultiSig(
	    txHex,
	    invocationScriptClean,
	    KNOWN_ADDRESSES[idToTransfer].account
	  );

	  transaction.addWitness(multiSigWitness);

	  console.log("\n\n--- Transaction ---");
	  console.log(JSON.stringify(transaction.export(), undefined, 2));

	  console.log("\n\n--- Transaction hash---");
	  console.log(transaction.hash)

	  console.log("\n\n--- Transaction string ---")
	  console.log(transaction.serialize(true));

	  return transaction;
	});

	console.log("Sending...")
	const sendTx = signTx.then(transaction => {
	    //const client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
	    //return client.sendRawTransaction(transaction.serialize(true));
	    sendRawTXToTheRPCNetwork(transaction.serialize(true));
	  })
	  .then(res => {
	    console.log("\n\n--- Response ---");
	    console.log(res);
	  })
	  .catch(err => console.log(err));

}

function createTxFromAccount(idTransferFrom, to, neo, gas, nodeToCall, networkToCall, sendingFromSCFlag = false){
    //balance = Neon.api.neoscan.getBalance('PrivateNet', from).then(res => console.log(res))
    var intent = createGasAndNeoIntent(to, neo, gas);

    console.log(intent) // This is an array of 2 Intent objects, one for each asset
    const config = {
        api: new Neon.api.neoscan.instance(networkToCall),
        url: nodeToCall,
        account: KNOWN_ADDRESSES[idTransferFrom].account,  // This is the address which the assets come from.
	sendingFromSmartContract: sendingFromSCFlag,
        intents: intent
    }
    console.log("GOing to send");

    Neon.default.sendAsset(config)
    .then(res => {
        //console.log("network:"+networkToCall);
        console.log(res.response);
        if(typeof(res.response.result) == "boolean") // 2.X
           createNotificationOrAlert("SendTX", res.response.result, 5000);
        else // 3.X
           createNotificationOrAlert("SendTX", "Status: " + res.response.result.succeed +  " Reason:" + res.response.result.reason, 5000);
    })
    .catch(e => {
        createNotificationOrAlert("SendTX", "Transfer transaction has failed!", 5000);
        console.log(e)
    })
}

//Private key or signing Function
function createClaimGasTX(idTransferFrom, nodeToCall, networkToCall){
    const config = {
        api: new Neon.api.neoscan.instance(networkToCall),
        url: nodeToCall,
        account: KNOWN_ADDRESSES[idTransferFrom].account  // This is the address which the assets come from.
    }

    //https://github.com/CityOfZion/neon-js/blob/6086ef5f601eb934593b0a0351ea763535298aa8/src/api/core.js#L38
    //https://github.com/CityOfZion/neon-js/blob/c6a169a82a4d037e00dccd424f53cdc818d6b3ae/src/transactions/transaction.js#L80
    //https://github.com/CityOfZion/neon-js/blob/fe588b7312cad90f20c4febe0e3f24d93b43ab20/src/wallet/Account.js#L19

    Neon.default.claimGas(config)
    .then(res => {
        //console.log("network:"+networkToCall);
        console.log(res.response)
        if(typeof(res.response.result) == "boolean") // 2.X
           createNotificationOrAlert("ClaimTX", res.response.result, 5000);
        else // 3.X
           createNotificationOrAlert("ClaimTX", "Status: " + res.response.result.succeed + " Reason:" + res.response.result.reason, 5000);
    })
    .catch(e => {
        createNotificationOrAlert("ClaimTX", "Claim transaction has failed!", 5000);
        console.log(e)
    })
}
