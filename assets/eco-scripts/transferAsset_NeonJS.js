/*async function transferAssetNeonJS(idTransferFrom, to, assetHashToTransfer, amount, nodeToCall) {
    const facade = await Neon.api.NetworkFacade.fromConfig({ node: nodeToCall });
    var fromAccount = ECO_WALLET[idTransferFrom].account;
    client = new Neon.rpc.NeoServerRpcClient(nodeToCall);
    const txid = await facade.transferToken(
        [{
            from: fromAccount,
            to: to,
            contractHash: assetHashToTransfer,
            decimalAmt: 0.00000001,
        }, ], {
            signingCallback: Neon.api.signWithAccount(fromAccount),
        }
    );
}*/

function transferMultiSign() {
    const script = Neon.sc.createScript({
        scriptHash: GAS_ASSET,
        operation: "transfer",
        args: [
            Neon.sc.ContractParam.hash160(ECO_WALLET[6].account.address),
            Neon.sc.ContractParam.hash160(ECO_WALLET[0].account.address),
            Neon.sc.ContractParam.integer(1),
            Neon.sc.ContractParam.any(),
        ],
    });

    const tx = new Neon.tx.Transaction({
            signers: [{
                account: ECO_WALLET[6].account.scriptHash,
                scopes: Neon.tx.WitnessScope.CalledByEntry,
            }, ],
            validUntilBlock: Neon.tx.Transaction.MAX_TRANSACTION_LIFESPAN + LAST_BEST_HEIGHT_NEOCLI - 1,
            systemFee: 100000000,
            networkFee: 100000000,
            script,
        })
        .sign(ECO_WALLET[2].account, NETWORK_MAGIC, 1024)
        .sign(ECO_WALLET[3].account, NETWORK_MAGIC, 1024)
        .sign(ECO_WALLET[4].account, NETWORK_MAGIC, 1024);

    const multisigWitness = Neon.tx.Witness.buildMultiSig(
        tx.serialize(false),
        tx.witnesses,
        ECO_WALLET[6].account
    );

    tx.witnesses = [multisigWitness];

    var client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
    const result = client.sendRawTransaction(tx);
}

/*
const facade = await Neon.api.NetworkFacade.fromConfig({ node: BASE_PATH_CLI });
facade.transferToken(
    [{
        from: ECO_WALLET[5].account,
        to: ECO_WALLET[5].account.address,
        contractHash: Neon.CONST.NATIVE_CONTRACT_HASH.GasToken,
        decimalAmt: 0.00000001,
    }, ], {
        signingCallback: Neon.api.signWithAccount(ECO_WALLET[5].account),
    }
);
*/
//transferAssetNeonJS(5,"NTrezR3C4X8aMLVg7vozt5wguyNfFhwuFx",Neon.CONST.NATIVE_CONTRACT_HASH.GasToken,10,BASE_PATH_CLI)

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
    var intent = createGasAndNeoIntent(to, neo, gas);

    setNeonApiProvider(networkToCall);
    const config = {
        api: NEON_API_PROVIDER,
        url: nodeToCall,
        account: ECO_WALLET[idTransferFrom].account, // This is the address which the assets come from.
        sendingFromSmartContract: sendingFromSCFlag,
        intents: intent
    }

    Neon.default.sendAsset(config)
        .then(res => {
            if (FULL_ACTIVITY_HISTORY && !DISABLE_ACTIVITY_HISTORY) {
                var sendParams = {
                    caller: ECO_WALLET[idTransferFrom].account.address,
                    to: to,
                    neo: neo,
                    gas: gas,
                    sendingFromSmartContract: sendingFromSCFlag,
                    type: "send"
                }
                updateVecRelayedTXsAndDraw(res.response.txid, JSON.stringify(sendParams));
            }
            createNotificationOrAlert("Asset_Send_Normal_Account", res.response.result, 5000);
        })
        .catch(err => {
            console.log(err);
            createNotificationOrAlert("Asset_Send_Normal_Account", "Transfer transaction has failed!", 5000);
        })
}

function createClaimGasTX(idTransferFrom, nodeToCall, networkToCall) {
    setNeonApiProvider(networkToCall);
    const config = {
        api: NEON_API_PROVIDER,
        url: nodeToCall,
        account: ECO_WALLET[idTransferFrom].account // This is the address which the assets come from.
    }

    Neon.default.claimGas(config)
        .then(res => {
            if (FULL_ACTIVITY_HISTORY && !DISABLE_ACTIVITY_HISTORY) {
                var claimParams = {
                    caller: ECO_WALLET[idTransferFrom].account.address,
                    type: "claim"
                }
                updateVecRelayedTXsAndDraw(res.response.txid, JSON.stringify(claimParams));
            }
            createNotificationOrAlert("GAS_Claim_Normal_Account", "Status: " + res.response.result + " txID: " + res.response.txid, 5000);
        })
        .catch(err => {
            console.log(err);
            createNotificationOrAlert("GAS_Claim_Normal_Account", "Claim transaction has failed!", 5000);
        })
}

/* ======================================================== */
/* ================= MULTI SIG ASSETS TRANSFER ============ */
function createTxFromMSAccount(idToTransfer, to, neo, gas, networkToCall) {
    setNeonApiProvider(networkToCall);
    console.log("Constructing " + to + " neo: " + neo + " gas: " + gas)
    var constructTx = NEON_API_PROVIDER.getBalance(ECO_WALLET[idToTransfer].account.address).then(balance => {
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

    setNeonApiProvider(networkToCall);
    var constructTx = NEON_API_PROVIDER.getClaims(ECO_WALLET[idToClaim].account.address).then(claims => {
        let transaction = Neon.default.create.claimTx();
        transaction.addClaims(claims);
        return transaction;
    });

    console.log("Signing...")
    signTx = signMultiTXNeonJs(idToClaim, constructTx);

    console.log("Sending...");
    const sendTx = sendingTxPromiseWithEcoRaw(signTx);
}
/* ================= MULTI SIG ASSETS TRANSFER ============ */
/* ======================================================== */