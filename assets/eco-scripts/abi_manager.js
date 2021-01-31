//=========== UPDATE ALL ABI DEPENDENCIES =======================
//===============================================================
function updateABITextarea(jsonABI) {
    var textAbi = "ScriptHash (big endian): " + jsonABI["hash"] + "\n";
    textAbi += "Entry Point:" + jsonABI["entrypoint"] + "\n";
    textAbi += "Methods:" + "\n";
    for (var i = 0; i < jsonABI["methods"].length; i++) {
        textAbi += "\t" + jsonABI["methods"][i]["returntype"] + " " + jsonABI["methods"][i]["name"] + "(";
        for (var f = 0; f < jsonABI["methods"][i]["parameters"].length; f++) {
            textAbi += jsonABI["methods"][i]["parameters"][f]["type"] + " " + jsonABI["methods"][i]["parameters"][f]["name"];
            if (f != jsonABI["methods"][i]["parameters"].length - 1)
                textAbi += ", ";
        }
        textAbi += ");\n";
    }
    textAbi += "Events:" + "\n";
    for (var e = 0; e < jsonABI["events"].length; e++) {
        textAbi += "\t" + jsonABI["events"][e]["returntype"] + " " + jsonABI["events"][e]["name"] + "(";
        for (var f = 0; f < jsonABI["events"][e]["parameters"].length; f++) {
            textAbi += jsonABI["events"][e]["parameters"][f]["type"] + " " + jsonABI["events"][e]["parameters"][f]["name"];
            if (f != jsonABI["events"][e]["parameters"].length - 1)
                textAbi += ", ";
        }
        textAbi += ");\n";
    }
    $("#textAreaCodeabi").val(textAbi);
}
//===============================================================

function ImportABIFromFile() {
    var file = document.getElementById("importABIFile").files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            var abiCodeFile = this.result;
            console.log("Printing loaded abi....")
            console.log(abiCodeFile);
            var abiCodeInJson = JSON.parse(abiCodeFile);
            console.log(abiCodeInJson);
            if (abiCodeInJson.hash) {
                $("#codeabi").val("");
                if ($("#codeavm").val() != "")
                    console.log("ABI will be loaded. Be carefull if deploying. ABI may not correspond to your current AVM!");
                updateScriptHashesBoxes(abiCodeInJson.hash.slice(2));
                updateAllABIDependencies(abiCodeInJson);
            }
        };
        reader.readAsBinaryString(file);
    }
    $('#importABIFile').val('');
}