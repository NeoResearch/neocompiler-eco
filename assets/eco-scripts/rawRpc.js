function frmRPCJson() {
    if ($("#txtRPCJson").val() == "Select a method")
        $("#txtRPCJson").val("");
    else
        $("#txtRPCJson").val("{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"" + $("#rpcMethod").val() + "\", \"params\": [\"\"] }");
};

function rawRpcCall(fillRealTx = false, saveID = -1, relay = false, blinkRelay = true) {
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        $("#txtRPCJson").val(), // Serializes form data in standard format
        function (data) {
            $("#txtRPCJsonOut").val(JSON.stringify(data, null, '  '));
            convertJsonNotifications();

            if (fillRealTx && checkIfWalletIsConnected())
                fillRealTxFromInvokeFunction();
            else
                cleanRealTxInvoke();

            if (saveID != -1)
                RELAYED_TXS[saveID].push(data);

            if (relay) {
                signAndRelay(false);
            } else {
                if (blinkRelay)
                    addBlinkToElement("#relay_btn");
            }
        },
        "json" // The format the response should be in
    ).fail(function () {
        $("#txtRPCJsonOut").val("failed to invoke network!");
    }); //End of POST for search
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

    $("#sys_fee")[0].value = invokeResult.result.gasconsumed / getFixed8();
    $("#net_fee")[0].value = 10000000 / getFixed8();
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

function signAndRelay(blinkRelay = true) {
    if (!checkIfWalletIsConnected())
        return;

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
    //var sysFee = getFixed8Integer(500);
    //var netFee = getFixed8Integer(600);
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

    if (isMultiSig(CONNECTED_WALLET_ID)) {
        var publicKeys = Neon.wallet.getPublicKeysFromVerificationScript(Neon.u.base642hex(ECO_WALLET[CONNECTED_WALLET_ID].account.contract.script))
        var threshold = Neon.wallet.getSigningThresholdFromVerificationScript(Neon.u.base642hex(ECO_WALLET[CONNECTED_WALLET_ID].account.contract.script))
        var signingAccountsIDs = getMultiSigSignersID(publicKeys, threshold);
        if (signingAccountsIDs.length < threshold) {
            swal({
                title: "Current Wallet is connected to a multisig!",
                text: "Your wallet has " + signingAccountsIDs.length + " accounts to sign. But required is " + threshold,
                icon: "error",
                button: "Ok!",
                timer: 5500,
            });
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
    RELAYED_TXS.push(relayedTX);


    console.log(tx)
    console.log(tx.serialize(true))
    var rawTX = Neon.u.hex2base64(tx.serialize(true));
    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "sendrawtransaction",
        "params": [rawTX]
    };

    var jsonToCallStringified = JSON.stringify(jsonForInvokingFunction);
    $("#txtRPCJson").val(jsonToCallStringified);
    rawRpcCall(false, RELAYED_TXS.length - 1, false, blinkRelay);
    //var client = new Neon.rpc.RPCClient(BASE_PATH_CLI);
    //RELAYED_TXS.push(client.sendRawTransaction(tx));
}