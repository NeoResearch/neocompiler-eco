var NATIVE_CONTRACTS = [];
var LOCAL_CONTRACTS = [];
var SWITCHED_CONTRACTS = false;
var CONTRACTS_TO_LIST = [];

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
                CONTRACTS_TO_LIST = NATIVE_CONTRACTS;
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

    if (CONTRACTS_TO_LIST.length > 0) {
        for (ka = 0; ka < CONTRACTS_TO_LIST.length; ++ka) {
            var infoToAdd = CONTRACTS_TO_LIST[ka].manifest.name + "(" + CONTRACTS_TO_LIST[ka].id + ")" + " - " + CONTRACTS_TO_LIST[ka].hash.slice(0, 4) + "..." + NATIVE_CONTRACTS[ka].hash.slice(-4);
            var titleToOption = "Click to select native contract " + CONTRACTS_TO_LIST[ka].manifest.name;
            addOptionToSelectionBox(infoToAdd, "native_" + ka, selectionBox, titleToOption);
        }
        document.getElementById(selectionBox).selectedIndex = 0;
    }
    createNativeManifest();
}

function createNativeManifest() {
    var selectionBox = "native_methods";
    document.getElementById(selectionBox).options.length = 0;

    if (CONTRACTS_TO_LIST.length > 0) {
        var cI = $("#native_contract")[0].selectedIndex;
        $("#native_hash").val(CONTRACTS_TO_LIST[cI].hash);
        $("#native_name").val(CONTRACTS_TO_LIST[cI].manifest.name);
        var methods = CONTRACTS_TO_LIST[cI].manifest.abi.methods;

        for (m = 0; m < methods.length; ++m) {
            var infoToAdd = methods[m].name + "(" + methods[m].parameters.length + " params)" + ": " + methods[m].returntype;
            var titleToOption = "Click to select native method contract " + methods[m].name;
            addOptionToSelectionBox(infoToAdd, "native_method_" + ka, selectionBox, titleToOption);
        }
        document.getElementById(selectionBox).selectedIndex = 0;
    }
    drawParametersTable();
}

function drawParametersTable() {
    var table = document.createElement("tbody");
    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headersName = document.createElement('td');
    var headersReturnType = document.createElement('td');
    var headersInput = document.createElement('td');

    headersName.innerHTML = "<b><center><font size='1'>NAME</font></b>";
    headerRow.insertCell(-1).appendChild(headersName);
    headersReturnType.innerHTML = "<b><center><font size='1'>RETURN TYPE</font></b>";
    headerRow.insertCell(-1).appendChild(headersReturnType);
    headersInput.innerHTML = "<b><center><font size='1'>INPUT</font></b>";
    headerRow.insertCell(-1).appendChild(headersInput);

    table.appendChild(headerRow);

    //Clear previous data
    document.getElementById("tableNativeParameters").innerHTML = "";
    if (CONTRACTS_TO_LIST.length > 0) {
        var nC = $("#native_contract")[0].selectedIndex;
        var m = $("#native_methods")[0].selectedIndex;
        var method = CONTRACTS_TO_LIST[nC].manifest.abi.methods[m];

        for (p = 0; p < method.parameters.length; p++) {
            var txRow = table.insertRow(-1);

            var paramName = document.createElement('span');
            paramName.setAttribute("class", "badge");
            paramName.textContent = method.parameters[p].name;
            txRow.insertCell(-1).appendChild(paramName);

            var paramType = document.createElement('span');
            paramType.setAttribute("class", "badge");
            paramType.textContent = method.parameters[p].type;
            txRow.insertCell(-1).appendChild(paramType);

            var paramInput = document.createElement('input');
            paramInput.setAttribute('id', "paramInput" + p);
            paramInput.placeholder = method.parameters[p].name + "(" + method.parameters[p].type + ")";
            txRow.insertCell(-1).appendChild(paramInput);
        } //Finishes loop that draws each relayed transaction
        //Append new table
        if (method.parameters.length > 0)
            document.getElementById("tableNativeParameters").appendChild(table);
    }
} //Finishes DrawWallets function
//===============================================================

function switchNativeContractsToContracts() {
    if (!SWITCHED_CONTRACTS) {
        $("#switch_contracts")[0].innerHTML = "Switch to Native Contracts <i class=\"fas fa-toggle-off\"></i>";
        $("#switch_contracts_title")[0].innerHTML = "Local Contracts";
        $("#breadcrumb-native-contracts")[0].innerHTML = "<a> Local Contracts</a>";
        $("#nav-desktop-native")[0].innerHTML = "<img src=\"./assets/icons/contracts.png\" style=\"width: 35px;padding-bottom: 4px;\"><p>Local Contracts</p>"
        $("#nav-mobile-native")[0].innerHTML = "<p>Local Contracts</p>"
        CONTRACTS_TO_LIST = LOCAL_CONTRACTS;
    } else {
        $("#switch_contracts")[0].innerHTML = "Switch to Contracts <i class=\"fas fa-toggle-on\"></i>";
        $("#switch_contracts_title")[0].innerHTML = "Native Contracts";
        $("#breadcrumb-native-contracts")[0].innerHTML = "<a> Native Contracts</a>";
        $("#nav-desktop-native")[0].innerHTML = "<img src=\"./assets/icons/contracts.png\" style=\"width: 35px;padding-bottom: 4px;\"><p>Native Contracts</p>"
        $("#nav-mobile-native")[0].innerHTML = "<p>Native Contracts</p>"
        CONTRACTS_TO_LIST = NATIVE_CONTRACTS;
    }

    // Clean script hashes and names
    $("#native_hash").val("");
    $("#native_name").val("");

    SWITCHED_CONTRACTS = !SWITCHED_CONTRACTS;
    addNativeToSelectionBox();
}