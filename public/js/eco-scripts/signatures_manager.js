function signTX(signerAccount, constructTxPromise) {
    return signTxPromise = constructTxPromise.then(transaction => {
        if (transaction)
            transaction.addAttribute(32, "23ba2703c53263e8d6e522dc32203339dcd8eee9");
        transaction.addAttribute(240, "313535343438373230303834323364663232303531");

        /*
          if (config.tx!.inputs.length === 0 && config.tx!.outputs.length === 0) {
            config.tx!.addAttribute(
              tx.TxAttrUsage.Script,
              u.reverseHex(wallet.getScriptHashFromAddress(config.account!.address))
            );
        */
        //.addRemark(
        //Date.now().toString() + u.ab2hexstring(u.generateRandomArray(4)) 

        const txHex = transaction.serialize(false);

        transaction.addWitness(Neon.tx.Witness.fromSignature(Neon.wallet.sign(txHex, signerAccount.privateKey), signerAccount.publicKey));

        console.log("\n\n--- Transaction ---");
        console.log(JSON.stringify(transaction.export(), undefined, 2));

        console.log("\n\n--- Transaction hash---");
        console.log(transaction.hash)

        console.log("\n\n--- Transaction string ---")
        console.log(transaction.serialize(true));

        console.log(transaction);

        return transaction;
    });
}

function addScriptsToPendingTx() {
    if(PendingTX == null)
    {
	console.error("Trying to get null Pending TX");
	return;
    }

    PendingTX.then(transaction => {
        transaction.scripts = [];
        var newScripts = JSON.parse($("#txt_AdvancedSigning_Signatures").val());
	console.log(newScripts);
        for(var s=0;s<newScripts.length;s++)
		transaction.addWitness(newScripts[s]);
	console.log("false");
	console.log(transaction.serialize(false));
	console.log("true");
	console.log(transaction.serialize(true));

        return transaction;
    });
}

function addAttributedAndTryToSign() {
    if(PendingTX == null)
    {
	console.error("Trying to get null Pending TX");
	return;
    }

    SignedTX = PendingTX.then(transaction => {
        transaction.attributes = [];

        if (transaction.inputs.length == 0)
            transaction.addAttribute(240, "313535343438373230303834323364663232303531");

        var nSelectedAddresses = $("#wallet_advanced_signing")[0].selectedOptions.length;
        for (var i = 0; i < nSelectedAddresses; i++) {
            var accountID = $("#wallet_advanced_signing")[0].selectedOptions[i].index;
            var accountScriptHash = ECO_WALLET[accountID].account.scriptHash;
            transaction.addAttribute(32, revertHexString(accountScriptHash));
        }

        var txHex = transaction.serialize(false);

        transaction.scripts = [];
        for (var i = 0; i < nSelectedAddresses; i++) {
            var accountID = $("#wallet_advanced_signing")[0].selectedOptions[i].index;
            var accountScriptHash = ECO_WALLET[accountID].account.scriptHash;

            var accountSignature;
            if (ECO_WALLET[accountID].account.isMultiSig) {
                accountSignature = getMultiSignWitnessFromAccountsWeKnown(accountID, txHex)
            } else if (ECO_WALLET[accountID].account._privateKey) {
                accountSignature = Neon.tx.Witness.fromSignature(Neon.wallet.sign(txHex, ECO_WALLET[accountID].account.privateKey), ECO_WALLET[accountID].account.publicKey);
            } else {
                var accountContractScript = ECO_WALLET[accountID].account.contract.script;
                accountSignature = {
                    _scriptHash: accountScriptHash,
                    invocationScript: "??????",
                    verificationScript: accountContractScript
                };
            }

            transaction.addWitness(accountSignature);
        }

	console.log(transaction.serialize(true))
        $("#tx_AdvancedSigning_ScriptHash").val(transaction.hash);
        $("#txScript_advanced_signing").val(transaction.serialize(false));
        $("#tx_AdvancedSigning_Size").val(transaction.serialize(true).length / 2);
        $("#tx_AdvancedSigning_HeaderSize").val(transaction.serialize(false).length / 2);
        $("#txt_AdvancedSigning_Signatures").val(JSON.stringify(transaction.scripts));

        return transaction;
    });
}

function getMultiSignWitnessFromAccountsWeKnown(idToTransfer, txHex) {
    jsonArrayWithPrivKeys = getMultiSigPrivateKeys(idToTransfer);
    verificationScript = ECO_WALLET[idToTransfer].account;

    invocationScriptClean = [];
    for (nA = 0; nA < jsonArrayWithPrivKeys.length; nA++)
        invocationScriptClean = fillSignaturesForMultiSign(txHex, invocationScriptClean, Neon.wallet.getPrivateKeyFromWIF(jsonArrayWithPrivKeys[nA].privKey));

    return Neon.tx.Witness.buildMultiSig(
        txHex,
        invocationScriptClean,
        ECO_WALLET[idToTransfer].account
    );
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
