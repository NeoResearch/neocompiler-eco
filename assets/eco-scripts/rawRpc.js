function frmRPCJson() {
    if ($("#txtRPCJson").val() == "Select a method")
        $("#txtRPCJson").val("");
    else
        $("#txtRPCJson").val("{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"" + $("#rpcMethod").val() + "\", \"params\": [\"\"] }");
};


function rawRpcCall(fillRealTx = false) {
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        $("#txtRPCJson").val(), // Serializes form data in standard format
        function(data) {
            $("#txtRPCJsonOut").val(JSON.stringify(data, null, '  '));
            convertJsonNotifications();
            if (fillRealTx)
                fillRealTxFromInvokeFunction();
        },
        "json" // The format the response should be in
    ).fail(function() {
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
    $("#net_fee")[0].value = 1000 / getFixed8();
    $("#tx_script")[0].value = Neon.u.base642hex(invokeResult.result.script);
    $("#valid_until")[0].value = Neon.tx.Transaction.MAX_TRANSACTION_LIFESPAN + LAST_BEST_HEIGHT_NEOCLI - 1;
    drawSigners();
}

function convertJsonNotifications() {
    //console.log(jsonObj);
    if ($("#txtRPCJsonOut").val() != "") {
        var jsonObj = JSON.parse($("#txtRPCJsonOut").val());
        console.log(jsonObj);

        if (jsonObj.length >= 1 && jsonObj[0].result && jsonObj[0].result.executions) {
            var myNotify = "";
            var notifArray = [];

            notifArray = jsonObj[0].result.executions[0].notifications;

            console.log("notifications:" + JSON.stringify(notifArray));
            for (var nSize = 0; nSize < notifArray.length; nSize++) {
                var jsonNotificationsObj = notifArray[nSize];
                myNotify += "Notification " + nSize + " typeI: " + jsonNotificationsObj.state.type + ";";
                myNotify += " typeII: " + jsonNotificationsObj.state.value[0].type + ";";
                myNotify += " value(hex): " + jsonNotificationsObj.state.value[0].value + ";";
                myNotify += " value(string): " + hex2bin(jsonNotificationsObj.state.value[0].value) + ".\n";
            }
            $("#txt_notifications").val(myNotify);
        } else {
            $("#txt_notifications").val("Notifications were not found!");
        }
    } else {
        $("#txt_notifications").val("empty RPC call output to check notification");
    }
}