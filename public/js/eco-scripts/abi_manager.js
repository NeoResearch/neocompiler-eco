//=========== UPDATE ALL ABI DEPENDENCIES =======================
//===============================================================
function updateAllABIDependencies(codeabi){
            if (codeabi.length != 0) {
                jsonABI = JSON.parse(codeabi);

                var textAbi = "ScriptHash (big endian): " + jsonABI["hash"] + "\n";
                textAbi += "Entry Point:" + jsonABI["entrypoint"] + "\n";
                textAbi += "Functions:" + "\n";

                for (var i = 0; i < jsonABI["functions"].length; i++) {
                    textAbi += "\t" +
                        jsonABI["functions"][i]["returntype"] + " " +
                        jsonABI["functions"][i]["name"] + "(";

                    if (jsonABI["functions"][i]["name"] != "Main") {
                        option2 = document.createElement("option");
                        option2.text = firstCharToLowerCase(jsonABI["functions"][i]["name"]);
                        option2.value = firstCharToLowerCase(jsonABI["functions"][i]["name"]);
                        inputboxjs.add(option2);
                    }

                    for (var f = 0; f < jsonABI["functions"][i]["parameters"].length; f++) {
                        textAbi += jsonABI["functions"][i]["parameters"][f]["type"] + " " +
                            jsonABI["functions"][i]["parameters"][f]["name"];
                        if (f != jsonABI["functions"][i]["parameters"].length - 1)
                            textAbi += ", ";
                    }
                    textAbi += ");\n";
                }
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
                // JS
                $("#cbx_usearray_js")[0].checked = false;
                if (paramhex == "0710") // enable array passing
                    $("#cbx_usearray_js")[0].checked = true;
                updateArrayInvokeParamsJs(); // update auxiliary check boxes
                updateInvokeParamsJs(); // update simple example

                // get return hexcode
                rettype = jsonABI["functions"][i]["returntype"];
		 $("#contractreturnjs")[0].value = getHexForType(rettype);
            }
}
//===============================================================

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

    if ($("#invokeparamjsbox1")[0].value != "None") {
        if ($("#cbx_inarray_js1")[0].checked)
            pushParams(arrayparam, $("#invokeparamjsbox1")[0].value, $("#invokeparamsjs1")[0].value);
        else
            pushParams(neonJSParams, $("#invokeparamjsbox1")[0].value, $("#invokeparamsjs1")[0].value);
    }
    if ($("#invokeparamjsbox2")[0].value != "None") {
        if ($("#cbx_inarray_js2")[0].checked)
            pushParams(arrayparam, $("#invokeparamjsbox2")[0].value, $("#invokeparamsjs2")[0].value);
        else
            pushParams(neonJSParams, $("#invokeparamjsbox2")[0].value, $("#invokeparamsjs2")[0].value);
    }
    if ($("#invokeparamjsbox3")[0].value != "None") {
        if ($("#cbx_inarray_js3")[0].checked)
            pushParams(arrayparam, $("#invokeparamjsbox3")[0].value, $("#invokeparamsjs3")[0].value);
        else
            pushParams(neonJSParams, $("#invokeparamjsbox3")[0].value, $("#invokeparamsjs3")[0].value);
    }

    if ($("#cbx_usearray_js")[0].checked)
        pushParams(neonJSParams, 'Array', arrayparam);

    $("#invokeparamsjs")[0].value = JSON.stringify(neonJSParams);
}

// block and unblock array checkboxes
function updateArrayInvokeParamsJs() {
    if ($("#cbx_usearray_js")[0].checked) {
        $("#cbx_inarray_js1")[0].checked = true;
        $("#cbx_inarray_js1")[0].disabled = false;
        $("#cbx_inarray_js2")[0].checked = true;
        $("#cbx_inarray_js2")[0].disabled = false;
        $("#cbx_inarray_js3")[0].checked = true;
        $("#cbx_inarray_js3")[0].disabled = false;
    } else {
        $("#cbx_inarray_js1")[0].checked = false;
        $("#cbx_inarray_js1")[0].disabled = true;
        $("#cbx_inarray_js2")[0].checked = false;
        $("#cbx_inarray_js2")[0].disabled = true;
        $("#cbx_inarray_js3")[0].checked = false;
        $("#cbx_inarray_js3")[0].disabled = true;
    }
}
// ==============================================================
