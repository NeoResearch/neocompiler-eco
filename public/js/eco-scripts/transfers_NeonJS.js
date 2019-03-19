//==========================================================================
function createGasAndNeoIntent(to, neo, gas) {
    var intent;
    if (neo > 0 && gas > 0)
        intent = Neon.api.makeIntent({
            NEO: neo,
            GAS: gas
        }, to)

    if (neo == 0 && gas > 0)
        intent = Neon.api.makeIntent({
            GAS: gas
        }, to)

    if (neo > 0 && gas == 0)
        intent = Neon.api.makeIntent({
            NEO: neo
        }, to)
    return intent;
}
//==========================================================================

function createTxFromAccount(idTransferFrom, to, neo, gas, nodeToCall, networkToCall, sendingFromSCFlag = false) {
    //balance = Neon.api.neoscan.getBalance('PrivateNet', from).then(res => console.log(res))
    var intent = createGasAndNeoIntent(to, neo, gas);

    //console.log(intent) // This is an array of 2 Intent objects, one for each asset
    const config = {
        api: new Neon.api.neoscan.instance(networkToCall),
        url: nodeToCall,
        account: ECO_WALLET[idTransferFrom].account, // This is the address which the assets come from.
        sendingFromSmartContract: sendingFromSCFlag,
        intents: intent
    }

    Neon.default.sendAsset(config)
        .then(res => {
            //console.log("createTxFromAccount:")
            //console.log(res.response);
            createNotificationOrAlert("SendTX", res.response.result, 5000);

            if (FULL_ACTIVITY_HISTORY) {
                var sendParams = {
                    caller: ECO_WALLET[idTransferFrom].account.address,
                    to: to,
                    neo: neo,
                    gas: gas,
                    sendingFromSCFlag: sendingFromSCFlag
                }
                updateVecRelayedTXsAndDraw(res.response.txid, "Send", "-", JSON.stringify(sendParams));
            }
            /*if(typeof(res.response.result) == "boolean") // 2.X
           createNotificationOrAlert("SendTX", res.response.result, 5000);
        else // 3.X
           createNotificationOrAlert("SendTX", "Status: " + res.response.result.succeed +  " Reason:" + res.response.result.reason, 5000);*/
        })
        .catch(e => {
            createNotificationOrAlert("SendTX", "Transfer transaction has failed!", 5000);
            console.log(e)
        })
}

function createClaimGasTX(idTransferFrom, nodeToCall, networkToCall) {
    const config = {
        api: new Neon.api.neoscan.instance(networkToCall),
        url: nodeToCall,
        account: ECO_WALLET[idTransferFrom].account // This is the address which the assets come from.
    }

    //https://github.com/CityOfZion/neon-js/blob/6086ef5f601eb934593b0a0351ea763535298aa8/src/api/core.js#L38
    //https://github.com/CityOfZion/neon-js/blob/c6a169a82a4d037e00dccd424f53cdc818d6b3ae/src/transactions/transaction.js#L80
    //https://github.com/CityOfZion/neon-js/blob/fe588b7312cad90f20c4febe0e3f24d93b43ab20/src/wallet/Account.js#L19

    Neon.default.claimGas(config)
        .then(res => {
            console.log("createClaimGasTX:")
            console.log(res.response)
            createNotificationOrAlert("ClaimTX", res.response.result, 5000);

            if (FULL_ACTIVITY_HISTORY) {
                var claimParams = {
                    caller: ECO_WALLET[idTransferFrom].account.address
                }
                updateVecRelayedTXsAndDraw(res.response.txid, "Claim", "-", JSON.stringify(claimParams));
            }

            //if(typeof(res.response.result) == "boolean") // 2.X
            //   createNotificationOrAlert("ClaimTX", res.response.result, 5000);
            //else // 3.X
            //   createNotificationOrAlert("ClaimTX", "Status: " + res.response.result.succeed + " Reason:" + res.response.result.reason, 5000);
        })
        .catch(e => {
            createNotificationOrAlert("ClaimTX", "Claim transaction has failed!", 5000);
            console.log(e)
        })
}

function signMultiTXNeonJs(idToTransfer, constructTxPromise) {
    jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToTransfer);
    verificationScript = ECO_WALLET[idToTransfer].account;

    const signTxPromise = constructTxPromise.then(transaction => {
        const txHex = transaction.serialize(false);

        invocationScriptClean = [];
        //var signatures=0;
        for (nA = 0; nA < jsonArrayWithPrivKeys.length; nA++) {
            invocationScriptClean = fillSignaturesForMultiSign(txHex, invocationScriptClean, Neon.wallet.getPrivateKeyFromWIF(jsonArrayWithPrivKeys[nA].privKey));
            //signatures++;
            //if(signatures >= ECO_WALLET[idToTransfer].account.contract.parameters.length)
            //	break;
        }

        const multiSigWitness = Neon.tx.Witness.buildMultiSig(
            txHex,
            invocationScriptClean,
            ECO_WALLET[idToTransfer].account
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
    return signTxPromise;
}

function sendingTxPromiseWithEcoRaw(txPromise) {
    const sendTxPromise = txPromise.then(transaction => {
            //const client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
            //return client.sendRawTransaction(transaction.serialize(true));
            console.log("sendingTxPromiseWithEcoRaw:");
            console.log(transaction);
            return sendRawTXToTheRPCNetwork(transaction.serialize(true), transaction.hash);
        })
        .then(res => {
            console.log("\n\n--- A response was achieved---");
            //console.log(res);
        })
        .catch(err => console.log(err));
    return sendTxPromise;
}


function createTxFromMSAccount(idToTransfer, to, neo, gas, networkToCall) {
    const neoscanAPIProvider = new Neon.api.neoscan.instance(networkToCall);
    console.log("Constructing " + to + " neo: " + neo + " gas: " + gas)
    var constructTx = neoscanAPIProvider.getBalance(ECO_WALLET[idToTransfer].account.address).then(balance => {
        let transaction = Neon.default.create.contractTx();
        if (neo > 0)
            transaction.addIntent("NEO", neo, to)
        if (gas > 0)
            transaction.addIntent("GAS", gas, to)
        transaction.calculate(balance);

        return transaction;
    });

    console.log("Signing...");
    const signTx = signMultiTXNeonJs(idToTransfer, constructTx);


    console.log("Sending...");
    const sendTx = sendingTxPromiseWithEcoRaw(signTx);
}

function createClaimMSGasTX(idToClaim, jsonArrayWithPrivKeys, networkToCall) {
    console.log("\n\n--- Creating claim tx ---");

    jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToClaim);
    verificationScript = ECO_WALLET[idToClaim].account;

    const neoscanAPIProvider = new Neon.api.neoscan.instance(networkToCall);


    var constructTx = neoscanAPIProvider.getClaims(ECO_WALLET[idToClaim].account.address).then(claims => {
        let transaction = Neon.default.create.claimTx();
        transaction.addClaims(claims);
        return transaction;
    });


    console.log("Signing...")
    signTx = signMultiTXNeonJs(idToClaim, constructTx);


    console.log("Sending...");
    const sendTx = sendingTxPromiseWithEcoRaw(signTx);
}
