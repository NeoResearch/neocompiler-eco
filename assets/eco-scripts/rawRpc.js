function frmRPCJson() {
    if ($("#txtRPCJson").val() == "Select a method")
        $("#txtRPCJson").val("");
    else
        $("#txtRPCJson").val("{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"" + $("#rpcMethod").val() + "\", \"params\": [\"\"] }");
};


function rawRpcCall() {
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        $("#txtRPCJson").val(), // Serializes form data in standard format
        function(data) {
            $("#txtRPCJsonOut").val(JSON.stringify(data, null, '  '));
            convertJsonNotifications();
        },
        "json" // The format the response should be in
    ).fail(function() {
        $("#txtRPCJsonOut").val("failed to invoke network!");
    }); //End of POST for search


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