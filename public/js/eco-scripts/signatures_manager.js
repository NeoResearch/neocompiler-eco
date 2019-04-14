function signTXWithSingleSigner(signerAccount, constructTxPromise) {
    return signTxPromise = constructTxPromise.then(transaction => {
        transaction.addAttribute(32, revertHexString(signerAccount.scriptHash));

        if (transaction.inputs.length == 0)
            transaction.addRemark(Date.now().toString() + Neon.u.ab2hexstring(Neon.u.generateRandomArray(4)));

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
    if (PendingTX == null) {
        console.error("Trying to get null Pending TX");
        return;
    }

    PendingTX.then(transaction => {
        var newScripts = JSON.parse($("#txt_AdvancedSigning_Signatures").val());
        transaction.scripts = [];
        for (var s = 0; s < newScripts.length; s++)
        {
                var accountSignature = new Neon.tx.Witness({
                    invocationScript: newScripts[s].invocationScript,
                    verificationScript: newScripts[s].verificationScript
                });
	    console.log(accountSignature)
            transaction.addWitness(accountSignature);
	}

        $("#txt_AdvancedSigning_Signatures").val(JSON.stringify(transaction.scripts));
        $("#tx_AdvancedSigning_Size").val(transaction.serialize(true).length / 2);
        return transaction;
    });
}

function addAttributedAndTryToSign() {
    if (PendingTX == null) {
        console.error("Trying to get null Pending TX");
        return;
    }

    PendingTX.then(transaction => {
        transaction.attributes = [];

        if (transaction.inputs.length == 0)
            transaction.addRemark(Date.now().toString() + Neon.u.ab2hexstring(Neon.u.generateRandomArray(4)));

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
                var accountSignature = new Neon.tx.Witness({
                    invocationScript: "??????",
                    verificationScript: accountContractScript
                });
            }

            transaction.addWitness(accountSignature);
        }

        console.log(transaction.serialize(true));
        $("#tx_AdvancedSigning_ScriptHash").val(transaction.hash);
        $("#txScript_advanced_signing").val(transaction.serialize(false));
        $("#tx_AdvancedSigning_HeaderSize").val(transaction.serialize(false).length / 2);
        $("#txt_AdvancedSigning_Signatures").val(JSON.stringify(transaction.scripts));
        $("#tx_AdvancedSigning_Size").val(transaction.serialize(true).length / 2);

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
