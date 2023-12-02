function getNodeInfo() {
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/1', function (data) {
        $("#node1data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node1data").scrollTop($("#node1data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/2', function (data) {
        $("#node2data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node2data").scrollTop($("#node2data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/3', function (data) {
        $("#node3data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node3data").scrollTop($("#node3data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/4', function (data) {
        $("#node4data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node4data").scrollTop($("#node4data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnode/0', function (data) {
        $("#noderpcdata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#noderpcdata").scrollTop($("#noderpcdata")[0].scrollHeight);
    });
}

// Get specific height from consensus log
// getSpecificNodeHeightInfo(02,11,2022,10,5)
function getSpecificNodeHeightInfo(day, month, year, height, nlines) {
    var cmdToAsk = day + "/" + month + "/" + year + "/" + height + "/" + nlines;
    //console.log("Lets ask" + cmdToAsk);

    $.get(BASE_PATH_ECOSERVICES + '/statusnodewithparams/1/' + cmdToAsk, function (data) {
        $("#node1data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node1data").scrollTop($("#node1data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnodewithparams/2/' + cmdToAsk, function (data) {
        $("#node2data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node2data").scrollTop($("#node2data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnodewithparams/3/' + cmdToAsk, function (data) {
        $("#node3data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node3data").scrollTop($("#node3data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnodewithparams/4/' + cmdToAsk, function (data) {
        $("#node4data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node4data").scrollTop($("#node4data")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusnodewithparams/0/' + cmdToAsk, function (data) {
        $("#noderpcdata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#noderpcdata").scrollTop($("#noderpcdata")[0].scrollHeight);
    });
}

function getAllFilteredNodeInfo() {
    var errorToAsk = $("#searchNodeStatusFilter")[0].value;

    $.get(BASE_PATH_ECOSERVICES + '/statusnodefiltered/' + errorToAsk, function (data) {
        $("#node1data").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#node1data").scrollTop($("#node1data")[0].scrollHeight);
    });

    $("#node2data").val("Check the first input box.");
    $("#node2data").scrollTop($("#node2data")[0].scrollHeight);

    $("#node3data").val("Check the first input box.");
    $("#node3data").scrollTop($("#node3data")[0].scrollHeight);

    $("#node4data").val("Check the first input box.");
    $("#node4data").scrollTop($("#node4data")[0].scrollHeight);

    $("#noderpcdata").val("Check the first input box.");
    $("#noderpcdata").scrollTop($("#noderpcdata")[0].scrollHeight);


    $("#oracleservicedata").val("Check the first input box.");
    $("#oracleservicedata").scrollTop($("#oracleservicedata")[0].scrollHeight);

    $("#oraclehttpsprotocoldata").val("Check the first input box.");
    $("#oraclehttpsprotocoldata").scrollTop($("#oraclehttpsprotocoldata")[0].scrollHeight);


    $("#verificationservicedata").val("Check the first input box.");
    $("#verificationservicedata").scrollTop($("#verificationservicedata")[0].scrollHeight);

    $("#verificationcontextdata").val("Check the first input box.");
    $("#verificationcontextdata").scrollTop($("#verificationcontextdata")[0].scrollHeight);

}

function getSpecificNodeHeightInfoFromForm() {
    var day, month, year, height, nlines;

    height = parseInt($("#height_filter_log")[0].value);
    nlines = parseInt($("#lines_filter_log")[0].value);

    var currentDate = new Date();
    if ($("#year_filter_log")[0].value == "")
        year = currentDate.getFullYear();
    else
        year = parseInt($("#year_filter_log")[0].value);

    if ($("#day_filter_log")[0].value == "")
        day = currentDate.getDate();
    else
        day = parseInt($("#day_filter_log")[0].value);

    if ($("#month_filter_log")[0].value == "")
        month = currentDate.getMonth() + 1;
    else
        month = parseInt($("#month_filter_log")[0].value);

    //console.log("height: " + height + "\tnlines: " + nlines + "\tyear: " + year + "\tday: " + day + "\tmonth: " + month);

    if (!Number.isInteger(height) || !Number.isInteger(nlines) || !Number.isInteger(year) || !Number.isInteger(day) || !Number.isInteger(month)) {
        console.error("Not Intenger found!!")
        return;
    }
    getSpecificNodeHeightInfo(day, month, year, height, nlines);
}



function getOracleInfo() {
    $.get(BASE_PATH_ECOSERVICES + '/statusservice/0/8', function (data) {
        $("#oracleservicedata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#oracleservicedata").scrollTop($("#oracleservicedata")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusservice/1/8', function (data) {
        $("#oraclehttpsprotocoldata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#oraclehttpsprotocoldata").scrollTop($("#oraclehttpsprotocoldata")[0].scrollHeight);
    });
}

function getStateInfo() {
    $.get(BASE_PATH_ECOSERVICES + '/statusservice/0/4', function (data) {
        $("#verificationservicedata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#verificationservicedata").scrollTop($("#verificationservicedata")[0].scrollHeight);
    });
    $.get(BASE_PATH_ECOSERVICES + '/statusservice/1/4', function (data) {
        $("#verificationcontextdata").val(data.replace(/[^\x00-\x7F]/g, ""));
        $("#verificationcontextdata").scrollTop($("#verificationcontextdata")[0].scrollHeight);
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
        function (data) {
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
            DEFAULT_WALLET.push({
                account: genesisMultiSigAccount,
                label: "CN-MultiSig",
                print: true
            });
            ECO_WALLET = DEFAULT_WALLET.concat(ECO_EXTRA_ACCOUNTS);
            drawPopulateAllWalletAccountsInfo();
        },
        "json" // The format the response should be in
    ).fail(function () {
        console.log("Error when trying to get nextvalidators");
    }); //End of POST for search
}