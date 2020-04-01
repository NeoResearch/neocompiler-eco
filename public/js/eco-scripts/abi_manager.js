//=========== UPDATE ALL ABI DEPENDENCIES =======================
//===============================================================
function updateAllABIDependencies(jsonABI){
            if (jsonABI.hash) {
                inputboxjs = document.getElementById("invokefunctionjs");
                while (inputboxjs.options.length > 0)
                    inputboxjs.remove(0);
                option = document.createElement("option");
                option.text = "Main";
                option.value = "Main";
                inputboxjs.add(option);
                var textAbi = "ScriptHash (big endian): " + jsonABI["hash"] + "\n";
                textAbi += "Entry Point:" + jsonABI["entrypoint"] + "\n";
                textAbi += "Methods:" + "\n";
		console.log("oi3")
                for (var i = 0; i < jsonABI["methods"].length; i++) {
                    textAbi += "\t" +
                        jsonABI["methods"][i]["returntype"] + " " +
                        jsonABI["methods"][i]["name"] + "(";

                    if (jsonABI["methods"][i]["name"] != "Main") {
                        option2 = document.createElement("option");
                        option2.text = firstCharToLowerCase(jsonABI["methods"][i]["name"]);
                        option2.value = firstCharToLowerCase(jsonABI["methods"][i]["name"]);
                        inputboxjs.add(option2);
                    }

                    for (var f = 0; f < jsonABI["methods"][i]["parameters"].length; f++) {
                        textAbi += jsonABI["methods"][i]["parameters"][f]["type"] + " " +
                            jsonABI["methods"][i]["parameters"][f]["name"];
                        if (f != jsonABI["methods"][i]["parameters"].length - 1)
                            textAbi += ", ";
                    }
                    textAbi += ");\n";
                }
		console.log("oi4")
                textAbi += "Events:" + "\n";
                for (var e = 0; e < jsonABI["events"].length; e++) {
                    textAbi += "\t" +
                        jsonABI["events"][e]["returntype"] + " " +
                        jsonABI["events"][e]["name"] + "(";
                    for (var f = 0; f < jsonABI["events"][e]["parameters"].length; f++) {
                        textAbi += jsonABI["events"][e]["parameters"][f]["type"] + " " +
                            jsonABI["events"][e]["parameters"][f]["name"];
                        if (f != jsonABI["events"][e]["parameters"].length - 1)
                            textAbi += ", ";
                    }
                    textAbi += ");\n";
                }
		console.log("oi5")
                $("#codeabi").val(textAbi);
		//console.log(textAbi);

                // parse ABI json
                //console.log("Parsing ABI json");
                // look for Main function
                var i = 0;
                for (i = 0; i < jsonABI["functions"].length; i++)
                    if (jsonABI["functions"][i]["name"] == "Main") {
                        //console.log("Found function 'Main' with id=" + i);
                        break;
                    }

                // get parameters
                $("#contractparamsjs")[0].value = "";
                $("#contractparamnamesjs")[0].value = "";
                var j = 0;
                //console.log("Parameter count:" + jsonABI["functions"][i]["parameters"].length);
                var paramhex = "";
                var paramnames = "";
                for (j = 0; j < jsonABI["functions"][i]["parameters"].length; j++) {
                    var phex = getHexForType(jsonABI["functions"][i]["parameters"][j]["type"]);
                    console.log("parameter[" + j + "]: " + jsonABI["functions"][i]["parameters"][j]["type"] + " -> hex(" + phex + ")");
                    paramhex += phex;
                    paramnames += jsonABI["functions"][i]["parameters"][j]["type"] + "\t";
                }
                if (paramhex.length > 0) {
                    $("#contractparamsjs")[0].value = paramhex;
                    $("#contractparamnamesjs")[0].value = paramnames;
                } else
                    $("#contractparamnamesjs")[0].value = "no parameters";

                // set invoke params to many empty strings (at least one is desirable for now)
                updateArrayInvokeParamsJs(); // update auxiliary check boxes
                updateInvokeParamsJs(); // update simple example

                // get return hexcode
                rettype = jsonABI["functions"][i]["returntype"];
		 $("#contractreturnjs")[0].value = getHexForType(rettype);
            }
}
//===============================================================

function ImportABIFromFile()
{
    var file = document.getElementById("importABIFile").files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
            var abiCodeFile = this.result;
            console.log("Printing loaded abi....")
            console.log(abiCodeFile);
	    var abiCodeInJson = JSON.parse(abiCodeFile);    
            console.log(abiCodeInJson);
	    if(abiCodeInJson.hash)
	    {
		$("#codeabi").val("");
		if($("#codeavm").val() != "")
			console.log("ABI will be loaded. Be carefull if deploying. ABI may not correspond to your current AVM!");	
	    	updateScriptHashesBoxes(abiCodeInJson.hash.slice(2));
            	updateAllABIDependencies(abiCodeInJson);
	    }
        };
        reader.readAsBinaryString(file);
    }
   $('#importABIFile').val(''); 
}

function updateScriptHashesBoxes(contractScriptHash){
                $("#contracthashjs")[0].value = contractScriptHash;
                $("#invokehashjs")[0].value = contractScriptHash;
                $("#gsf_contracthash")[0].value = contractScriptHash;
                $("#getnep5_contract")[0].value = contractScriptHash;
}

//===============================================================
// self update neonjs invoke parameters (in json format)
function updateInvokeParamsJs() {
    //console.log("updating js json...");
    invokefunc = "";
    if ($("#invokefunctionjs")[0].value != "Main")
        invokefunc = $("#invokefunctionjs")[0].value; // method
    var arrayparam = [];

    //console.log("function is "+invokefunc);
    var neonJSParams = [];

    if (invokefunc != "")
        pushParams(neonJSParams, "String", invokefunc);
    
	var i = 1;
	while($("#invokeparamjsbox"+i).length > 0){
		if ($("#invokeparamjsbox"+i)[0].value != "None") {
			if ($("#cbx_inarray_js"+i)[0].checked)
				pushParams(arrayparam, $("#invokeparamjsbox"+i)[0].value, $("#invokeparamsjs"+i)[0].value);
			else
				pushParams(neonJSParams, $("#invokeparamjsbox"+i)[0].value, $("#invokeparamsjs"+i)[0].value);
		}
		i++;
	}

    if ($("#cbx_usearray_js")[0].checked)
        pushParams(neonJSParams, 'Array', arrayparam);

    $("#invokeparamsjs")[0].value = JSON.stringify(neonJSParams);
}

// block and unblock array checkboxes
function updateArrayInvokeParamsJs() {
	var paramId = 1;
    if ($("#cbx_usearray_js")[0].checked) {
		while($("#cbx_inarray_js"+paramId).length>0){
			$("#cbx_inarray_js"+paramId)[0].checked = true;
			$("#cbx_inarray_js"+paramId)[0].disabled = false;
			paramId++;
		}
    } else {
		while($("#cbx_inarray_js"+paramId).length>0){
			$("#cbx_inarray_js"+paramId)[0].checked = false;
			$("#cbx_inarray_js"+paramId)[0].disabled = true;
			paramId++;
		}
    }
    updateInvokeParamsJs();
}
// ==============================================================
