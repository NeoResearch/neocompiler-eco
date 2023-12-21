function frmRPCJson() {
    $("#txtRPCJson").val("{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"" + $("#rpcMethodSelectionBox").val() + "\", \"params\": [\"\"] }");
};

function rawRpcCall(fillRealTx = false, saveID = -1, relay = false, blinkRelay = true) {
    if ($("#txtRPCJson").val() === "") {
        swal2Simple("Error. JSON RPC call is empty", "Pick a method", 5500, "error");
        return;
    }
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        $("#txtRPCJson").val(), // Serializes form data in standard format
        function (data) {
            $("#txtRPCJsonOut").val(JSON.stringify(data, null, '  '));
            convertJsonNotifications();

            cleanRealTxInvoke();

            if (fillRealTx && checkIfWalletIsConnected())
                fillRealTxFromInvokeFunction();

            if (saveID != -1) {
                // updates saved tx with input
                RELAYED_TXS[saveID].push(data);
                storeActivitiesToLocalStorage();
            }

            if (relay) {
                signAndRelay();
            } else {
                if (blinkRelay && fillRealTx) {
                    enableSignRelayAndBlink();
                } else {
                    $("#relay_btn")[0].disabled = true;
                    $('#signAndRelayDivCollapse').collapse('hide');
                }
            }
        },
        "json" // The format the response should be in
    ).fail(function () {
        $("#txtRPCJsonOut").val("failed to invoke network!");
    }); //End of POST for search
}

function enableSignRelayAndBlink() {
    $('#signAndRelayDivCollapse').collapse('show');
    $("#relay_btn")[0].disabled = false;
    addBlinkToElement("#relay_btn");
}

function drawSigners() {
    var table = document.createElement("tbody");
    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headersAccount = document.createElement('td');
    var headersScope = document.createElement('td');


    headersAccount.innerHTML = "<b><center><font size='1'>ACCOUNT</font></b>";
    headerRow.insertCell(-1).appendChild(headersAccount);
    headersScope.innerHTML = "<b><center><font size='1'>SCOPES</font></b>";
    headerRow.insertCell(-1).appendChild(headersScope);

    table.appendChild(headerRow);

    document.getElementById("tableSigners").innerHTML = "";

    var txRow = table.insertRow(-1);

    var paramAccount = document.createElement('span');
    paramAccount.setAttribute("class", "badge");
    paramAccount.textContent = ECO_WALLET[CONNECTED_WALLET_ID].account.scriptHash;
    txRow.insertCell(-1).appendChild(paramAccount);

    var paramScope = document.createElement('span');
    paramScope.setAttribute("class", "badge");
    paramScope.textContent = "CalledByEntry";
    txRow.insertCell(-1).appendChild(paramScope);

    document.getElementById("tableSigners").appendChild(table);
}

function fillRealTxFromInvokeFunction() {
    var invokeResult = JSON.parse($("#txtRPCJsonOut").val());
    if (!invokeResult.result)
        return;

    if (!invokeResult.result.script) {
        var sTitle = "Invoking error";
        var sText = "There is not a script in this call to be invoked with a wallet. Call a diferent method. Then you can try to send to blockchain.";
        swal2Simple(sTitle, sText, 5500, "error");
        return;
    }

    $("#sys_fee")[0].value = invokeResult.result.gasconsumed / getFixed8();
    $("#net_fee")[0].value = 20000000 / getFixed8();
    $("#tx_script")[0].value = Neon.u.base642hex(invokeResult.result.script);
    $("#valid_until")[0].value = Neon.tx.Transaction.MAX_TRANSACTION_LIFESPAN + LAST_BEST_HEIGHT_NEOCLI - 1;
    drawSigners();
}

function cleanRealTxInvoke() {
    $("#sys_fee")[0].value = "";
    $("#net_fee")[0].value = "";
    $("#tx_script")[0].value = "";
    $("#valid_until")[0].value = "";
    document.getElementById("tableSigners").innerHTML = "";
}

function signAndRelay() {
    if (!checkIfWalletIsConnected())
        return;

    //Network fee should be passed to DAPI
    var netFee = Math.ceil(getFixed8Integer($("#net_fee")[0].value));
    //============================================
    //This is dapi call from parameters
    var callDapi = getDapiConnectedWallet() == CONNECTED_WALLET_ID;
    if (callDapi) {
        var dapiParams = JSON.parse($("#txtRPCJson").val());
        if (!dapiParams.params) {
            console.error("Trying to call DAPI WRONG. Params are missing;");
            return;
        }
        var signerHash = ECO_WALLET[CONNECTED_WALLET_ID].account.scriptHash;

        invokeWithParametersDAPI(CONNECTED_DAPI_WALLET_OBJ, netFee, dapiParams.params[0], dapiParams.params[1], dapiParams.params[2], signerHash);

        return;
    }
    //============================================

    var sysFee = Math.ceil(getFixed8Integer($("#sys_fee")[0].value));
    var validUntil = Number($("#valid_until")[0].value);
    var script = $("#tx_script")[0].value;

    const tx = new Neon.tx.Transaction({
        signers: [{
            account: ECO_WALLET[CONNECTED_WALLET_ID].account.scriptHash,
            scopes: Neon.tx.WitnessScope.CalledByEntry,
        },],
        validUntilBlock: validUntil,
        script: script,
        systemFee: sysFee,
        networkFee: netFee,
    })

    signTx(tx);

    var relayedTX = [];
    relayedTX.push({
        signers: document.getElementById("tableSigners").lastChild,
        sysfee: $("#sys_fee")[0].value,
        netfee: $("#net_fee")[0].value,
        validUntil: $("#valid_until")[0].value,
        script: $("#tx_script")[0].value,
        invokeFunction: $("#txtRPCJson").val(),
        invokeFunctionOut: $("#txtRPCJsonOut").val()
    });

    // Create Field for TXs
    RELAYED_TXS.push(relayedTX);
    storeActivitiesToLocalStorage();

    //console.log(tx)
    //console.log(tx.serialize(true))
    var rawTX = Neon.u.hex2base64(tx.serialize(true));

    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 2,
        "method": "sendrawtransaction",
        "params": [rawTX]
    };
    var jsonToCallStringified = JSON.stringify(jsonForInvokingFunction);

    $("#txtRPCJson").val(jsonToCallStringified);
    var fillRealTx = false;
    var autoRelay = false;
    var autoBlink = false;
    var savedTXID = RELAYED_TXS.length - 1;
    rawRpcCall(fillRealTx, savedTXID, autoRelay, autoBlink);
}

function signTx(tx) {
    if (isMultiSig(CONNECTED_WALLET_ID)) {
        var base64VerificationScript = ECO_WALLET[CONNECTED_WALLET_ID].account.contract.script;
        var hexVerificationScript = Neon.u.base642hex(base64VerificationScript);
        var publicKeys = Neon.wallet.getPublicKeysFromVerificationScript(hexVerificationScript);
        var threshold = Neon.wallet.getSigningThresholdFromVerificationScript(hexVerificationScript);
        var signingAccountsIDs = getMultiSigSignersID(publicKeys, threshold);
        if (signingAccountsIDs.length < threshold) {
            var sText = "Current Wallet is connected to a multisig!" + "Your wallet has " + signingAccountsIDs.length + " accounts to sign. But required is " + threshold;
            swal2Simple("Wallet while signing", sText, 5500, "error");
        }

        for (sa = 0; sa < signingAccountsIDs.length; sa++)
            tx.sign(ECO_WALLET[signingAccountsIDs[sa]].account, NETWORK_MAGIC)

        const multisigWitness = Neon.tx.Witness.buildMultiSig(
            tx.serialize(false),
            tx.witnesses,
            ECO_WALLET[CONNECTED_WALLET_ID].account
        );

        tx.witnesses = [multisigWitness];
    } else {
        tx.sign(ECO_WALLET[CONNECTED_WALLET_ID].account, NETWORK_MAGIC)
    }
}