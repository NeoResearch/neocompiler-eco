var NATIVE_CONTRACTS = [];
var LOCAL_CONTRACTS = [];
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
                addNativeToSelectionBox("native_contracts", "native");
            },
            "json" // The format the response should be in
        ).fail(function() {
            console.log("Error when trying to get getnativecontracts");
        }); //End of POST for search
    }

    if (LOCAL_CONTRACTS.length == 0) {
        document.getElementById("local_contracts").options.length = 0;
        addOptionToSelectionBox("There aren't saved local contracts", "emptyID", "local_contracts", "Please import one local contract.");
    }
}

function addNativeToSelectionBox(selectionBox, info) {
    document.getElementById(selectionBox).options.length = 0;

    if (CONTRACTS_TO_LIST.length > 0) {
        for (ka = 0; ka < CONTRACTS_TO_LIST.length; ++ka) {
            var contractID = CONTRACTS_TO_LIST[ka].id;
            if (!contractID)
                contractID = "Not yet deployed"
            var infoToAdd = CONTRACTS_TO_LIST[ka].manifest.name + "(" + contractID + ")" + " - " + CONTRACTS_TO_LIST[ka].hash.slice(0, 4) + "..." + CONTRACTS_TO_LIST[ka].hash.slice(-4);
            var titleToOption = "Click to select " + info + " contract " + CONTRACTS_TO_LIST[ka].manifest.name;
            addOptionToSelectionBox(infoToAdd, info + "_" + ka, selectionBox, titleToOption);
        }
        document.getElementById(selectionBox).selectedIndex = 0;
    }

    if (selectionBox === "native_contracts") {
        createNativeManifest();
    } else {
        createLocalManifest();
    }
}

function createNativeManifest() {
    CONTRACTS_TO_LIST = NATIVE_CONTRACTS;
    $("#local_contracts")[0].selectedIndex = -1
    createManifest();
}

function createLocalManifest() {
    CONTRACTS_TO_LIST = LOCAL_CONTRACTS;
    $("#native_contracts")[0].selectedIndex = -1
    createManifest();
}

function getCurrentSelectedContract() {
    var cI = $("#native_contracts")[0].selectedIndex;
    if (cI == -1)
        cI = $("#local_contracts")[0].selectedIndex;
    return cI;
}

function createManifest() {
    var selectionBox = "contract_methods";
    document.getElementById(selectionBox).options.length = 0;

    if (CONTRACTS_TO_LIST.length > 0) {
        var cI = getCurrentSelectedContract();
        $("#contract_hash").val(CONTRACTS_TO_LIST[cI].hash);
        $("#contract_name").val(CONTRACTS_TO_LIST[cI].manifest.name);
        var methods = CONTRACTS_TO_LIST[cI].manifest.abi.methods;

        for (m = 0; m < methods.length; ++m) {
            var infoToAdd = methods[m].name + "(" + methods[m].parameters.length + " params)" + ": " + methods[m].returntype;
            var titleToOption = "Click to select contract method contract " + methods[m].name;
            addOptionToSelectionBox(infoToAdd, "contract_method_" + ka, selectionBox, titleToOption);
        }
        document.getElementById(selectionBox).selectedIndex = 0;
    }
    drawParametersTable(cI);
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
        var m = $("#contract_methods")[0].selectedIndex;
        var method = CONTRACTS_TO_LIST[getCurrentSelectedContract()].manifest.abi.methods[m];

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

function invokeFunction() {
    var m = $("#contract_methods")[0].selectedIndex;
    var method = CONTRACTS_TO_LIST[getCurrentSelectedContract()].manifest.abi.methods[m];
    var invokeparams = [];
    invokeparams.push(CONTRACTS_TO_LIST[getCurrentSelectedContract()].hash);
    invokeparams.push(method.name);
    var params = [];
    for (p = 0; p < method.parameters.length; p++) {
        var inputVar = "#paramInput" + p;
        if ($(inputVar)[0].value === "") {
            var content = document.createElement('div');
            content.innerHTML = '<b>' + method.parameters[p].name + '</b> Parameter should be filled.';
            swal("Error. There are parameters that need to be filled.", {
                icon: "error",
                content: content,
                buttons: false,
                timer: 3500,
            });
            break;
        }
        var parameter = {
            type: method.parameters[p].type,
            value: $(inputVar)[0].value
        };
        params.push(parameter);
    }
    invokeparams.push(params);

    console.log(invokeparams);
    var jsonForInvokingFunction = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "invokefunction",
        "params": invokeparams
    };

    console.log(jsonForInvokingFunction);
    console.log(JSON.stringify(jsonForInvokingFunction));
    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        JSON.stringify(jsonForInvokingFunction), // Serializes form data in standard format
        function(data) {
            console.log(data);
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.log("Error when trying to get jsonForInvokingFunction");
    }); //End of POST for search

}

function saveLocalContract() {
    var contractHashToAdd = $("#import_contract_hash").val();
    var jsonForGetContractsState = {
        "jsonrpc": "2.0",
        "id": 5,
        "method": "getcontractstate",
        "params": [contractHashToAdd]
    };


    $.post(
        BASE_PATH_CLI, // Gets the URL to sent the post to
        JSON.stringify(jsonForGetContractsState), // Serializes form data in standard format
        function(data) {
            if (data.result) {
                console.log(data);
                LOCAL_CONTRACTS.push(data.result);
                CONTRACTS_TO_LIST = LOCAL_CONTRACTS;
                addNativeToSelectionBox("local_contracts", "local_contract");
                $("#local_contracts")[0].selectedIndex = $("#local_contracts")[0].length - 1;
            }
        },
        "json" // The format the response should be in
    ).fail(function() {
        console.log("Error when trying to get getnativecontracts");
    }); //End of POST for search
}