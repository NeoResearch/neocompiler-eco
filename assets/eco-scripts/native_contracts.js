var NATIVE_CONTRACTS = [];

function getNativeInfo() {
    if (NATIVE_CONTRACTS.length == 0) {
        var jsonForGetNativeContracts = {
            "jsonrpc": "2.0",
            "id": 5,
            "method": "getnativecontracts",
            "params": []
        };


        $.post(
            BASE_PATH_CLI, // Gets the URL to sent the post to
            JSON.stringify(jsonForGetNativeContracts), // Serializes form data in standard format
            function(data) {
                //console.log(data);
                NATIVE_CONTRACTS = data.result;
                //console.log(NATIVE_CONTRACTS);
                addNativeToSelectionBox();
            },
            "json" // The format the response should be in
        ).fail(function() {
            console.log("Error when trying to get getnativecontracts");
        }); //End of POST for search
    }
}

function addNativeToSelectionBox() {
    var selectionBox = "native_contract";
    document.getElementById(selectionBox).options.length = 0;
    for (ka = 0; ka < NATIVE_CONTRACTS.length; ++ka) {

        var infoToAdd = NATIVE_CONTRACTS[ka].manifest.name + "(" + NATIVE_CONTRACTS[ka].id + ")" + " - " + NATIVE_CONTRACTS[ka].hash.slice(0, 4) + "..." + NATIVE_CONTRACTS[ka].hash.slice(-4);
        var titleToOption = "Click to select native contract " + NATIVE_CONTRACTS[ka].manifest.name;
        addOptionToSelectionBox(infoToAdd, "native_" + ka, selectionBox, titleToOption);
    }
}

function createNativeManifest() {
    var cI = $("#native_contract")[0].selectedIndex;
    $("#native_hash").val(NATIVE_CONTRACTS[cI].hash);
    $("#native_name").val(NATIVE_CONTRACTS[cI].manifest.name);

    var selectionBox = "native_methods";
    document.getElementById(selectionBox).options.length = 0;
    var methods = NATIVE_CONTRACTS[cI].manifest.abi.methods;
    for (m = 0; m < methods.length; ++m) {
        var infoToAdd = methods[m].name + "(" + methods[m].returntype + ")" + " - " + methods[m].parameters.length + " parameters";
        var titleToOption = "Click to select native method contract " + methods[m].name;
        addOptionToSelectionBox(infoToAdd, "native_method_" + ka, selectionBox, titleToOption);
    }

}