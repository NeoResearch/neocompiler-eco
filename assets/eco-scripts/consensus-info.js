function getNodeInfo() {
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/1', function(data) {
        $("#node1data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node1data").scrollTop($("#node1data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/2', function(data) {
        $("#node2data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node2data").scrollTop($("#node2data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/3', function(data) {
        $("#node3data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node3data").scrollTop($("#node3data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/4', function(data) {
        $("#node4data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node4data").scrollTop($("#node4data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/0', function(data) {
        $("#noderpcdata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#noderpcdata").scrollTop($("#noderpcdata")[0].scrollHeight);
    });
}


function getOracleInfo() {
    $.get(BASE_PATH_ECOSERVICES + '/statusoracles/0', function(data) {
        $("#oracleservicedata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#oracleservicedata").scrollTop($("#oracleservicedata")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusoracles/1', function(data) {
        $("#oraclehttpsprotocoldata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#oraclehttpsprotocoldata").scrollTop($("#oraclehttpsprotocoldata")[0].scrollHeight);
    });
}

function createMultiSigFromNextValidators() {
    var jsonForGetValidators = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getcommittee",
        "params": []
    };

    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        JSON.stringify(jsonForGetValidators), // Serializes form data in standard format
        function(data) {
            var arrayMSValidators = [];
            for (i = 0; i < data.result.length; i++) {
                var tempAccount = new Neon.wallet.Account(data.result[i]);
                arrayMSValidators.push(tempAccount.publicKey);
                /*ECO_WALLET.push({
                    account: new Neon.wallet.Account(tempAccount.publicKey),
                    label: "CN" + i,
                    print: true
                });*/
            }
            var genesisMultiSigAccount = Neon.wallet.Account.createMultiSig(3, arrayMSValidators);
            ECO_WALLET.push({
                account: genesisMultiSigAccount,
                label: "CN-MultiSig",
                print: true
            });
            drawPopulate();
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.log("Error when trying to get nextvalidators");
    }); //End of POST for search
}

createMultiSigFromNextValidators()