	$("#getnep5balance").submit(function (e) {
	    e.preventDefault(); // Prevents the page from refreshing
	    $("#output_getnep5").val("");
	    $("#output_getnep5_extra").val("");
	    var addressRevertedScriptHash = revertHexString(fromBase58($("#getnep5_address")[0].value));

	    strrequest = '{ "jsonrpc": "2.0", "id": 5, "method": "getstorage", "params": ["'+$("#getnep5_contract")[0].value+'","'+addressRevertedScriptHash+'"]}';
	    //console.log($("#neonodeurl")[0].value);
	    //console.log(strrequest);
	    $.post(
		BASE_PATH_CLI, // Gets the Neo-CLi URL to sent the post to
		strrequest,
		function (data) {
		  //console.log(data);
		  valfixed8 = data.result;
		  const a = new Neon.u.Fixed8.fromHex(revertHexString(valfixed8));
		  $("#output_getnep5").val(a);

		  strgetblock = '{ "jsonrpc": "2.0", "id": 5, "method": "getblockcount", "params": [""] }';
		  $.post(
		      $("#rpc_nodes_path")[0].value, // Gets the URL to sent the post to
		      strgetblock,
		      function (data2) {
		        //console.log(data);
		        blockheight = data2.result;
		        //addr = toBase58($("#getnep5_address")[0].value);
			addr=$("#getnep5_address")[0].value;
		        $("#output_getnep5_extra").val(addr + " / H:"+blockheight);
		      },
		      "json" // The format the response should be in
		  ).fail(function() {
		      $("#output_getnep5_extra").val("failed to invoke network!");
		  }); //End of POST for search

		},
		"json" // The format the response should be in
	    ).fail(function() {
		$("#output_getnep5").val("failed to invoke network!");
	    }); //End of POST for search
	});


   function firstCharToLowerCase(str) {
		if(str == "")
			return "";
		return str.charAt(0).toLowerCase() + str.slice(1);
	}


    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	//console.log(e.target.dataset.target)


        if($("#csharpcode.tab-pane.active.cont").length != 0) {
            updateCompilersSelectionBox("docker-mono-neo-compiler");
            //console.log("C# Compile");
        }
        if($("#pythoncode.tab-pane.active.cont").length != 0) {
            updateCompilersSelectionBox("docker-neo-boa");
            //console.log("Python Compile");
        }
        if($("#golangcode.tab-pane.active.cont").length != 0) {
            updateCompilersSelectionBox("docker-neo-go");
            //console.log("Golang Compile");
        }
        if($("#javacode.tab-pane.active.cont").length != 0) {
            updateCompilersSelectionBox("docker-java-neo-compiler");
            //console.log("Java Compile");
        }

    });

    //===============================================================
    $("#formCompile").submit(function (e) {
        $("#compilebtn")[0].disabled = true;
        $("#code_cs").val("");
        $("#code_python").val("");
        $("#code_golang").val("");
        $("#code_java").val("");
        if($("#csharpcode.tab-pane.active.cont").length != 0) {
            $("#code_cs").val(ace.edit("editorCSharp").getSession().getValue());
            console.log("C# Compile");
        }
        if($("#pythoncode.tab-pane.active.cont").length != 0) {
            $("#code_python").val(ace.edit("editorPython").getSession().getValue());
            console.log("Python Compile");
        }
        if($("#golangcode.tab-pane.active.cont").length != 0) {
            $("#code_golang").val(ace.edit("editorGolang").getSession().getValue());
            console.log("Golang Compile");
        }
        if($("#javacode.tab-pane.active.cont").length != 0) {
            $("#code_java").val(ace.edit("editorJava").getSession().getValue());
            console.log("Java Compile");
        }
        $("#codewarnerr").val("");
        $("#codeavm").val("");
        $("#opcodes").val("");
        $("#codeabi").val("");
        $("#contracthash").val("");
        //$("#contracthash_search").val("");
        $("#invokehash").val("");
        $("#contractparams").val("\"\"");
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this); // `this` refers to the current form element
        var indata = $(this).serialize();
        $.post(
            BASE_PATH_COMPILERS + $this.attr("action"), // Gets the URL to sent the post to
            indata, // Serializes form data in standard format
            function (data) {
                console.log("finished compiling");
                $("#compilebtn")[0].disabled = false;
                var coderr = atob(data.output);
                $("#codewarnerr").val(coderr);
                var hexcodeavm = atob(data.avm);
                $("#codeavm").val(hexcodeavm);
                hexcodeavm = hexcodeavm.replace(/(\r\n|\n|\r)/gm, "");
                $("#opcodes").val("");
                //printOpcode(hexcodeavm, $("#opcodes"));
                //console.log("GRAVANDO BINARIO: "+typeof(datacontent)+":"+datacontent);
                localStorage.setItem('avmFile', hexcodeavm);//, {type: 'application/octet-stream'});
                //datacontent = localStorage.getItem('avmFile', {type: 'application/octet-stream'});
                //console.log("LENDO BINARIO: "+typeof(datacontent)+":"+datacontent);

                //console.log(localStorage.getItem('avmFile').charCodeAt(0));
                //console.log(localStorage.getItem('avmFile').charCodeAt(1));
                //console.log(localStorage.getItem('avmFile').charCodeAt(2));
                //$("#btn_download")[0].style = "";

                $("#contracthash")[0].value = getScriptHashFromAVM(hexcodeavm);
		$("#contracthashjs")[0].value = getScriptHashFromAVM(hexcodeavm);
                //$("#contracthash_search")[0].value = $("#contracthash")[0].value;
                $("#invokehash")[0].value = $("#contracthash")[0].value;
                $("#invokehashjs")[0].value = $("#contracthash")[0].value;
                $("#gsf_contracthash")[0].value = $("#contracthash")[0].value;

                var codeabi = atob(data.abi);
                console.log(codeabi);

                inputbox2 = document.getElementById("invokefunctionpy");
                while(inputbox2.options.length > 0)
                   inputbox2.remove(0);
                inputboxjs2 = document.getElementById("invokefunctionjs");
                while(inputboxjs2.options.length > 0)
                   inputboxjs2.remove(0);

                option = document.createElement("option");
                option.text = "Main";
                option.value = "Main";
                inputbox2.add(option);

                option2 = document.createElement("option");
                option2.text = "Main";
                option2.value = "Main";
                inputboxjs2.add(option2);

                if( codeabi.length != 0)
                {
                    jsonABI = JSON.parse(codeabi);

                    var textAbi = "ScriptHash (big endian): " + jsonABI["hash"] + "\n";
                    textAbi += "Entry Point:" + jsonABI["entrypoint"] + "\n";
                    textAbi += "Functions:" + "\n";

                    for (var i = 0; i < jsonABI["functions"].length; i++)
                    {
                        textAbi += "\t" +
                            jsonABI["functions"][i]["returntype"] + " " +
                            jsonABI["functions"][i]["name"] + "(";

                        if(jsonABI["functions"][i]["name"] != "Main") {
                            option = document.createElement("option");
                            option.text  = firstCharToLowerCase(jsonABI["functions"][i]["name"]);
                            option.value = firstCharToLowerCase(jsonABI["functions"][i]["name"]);
                            inputbox2.add(option);
                            option2 = document.createElement("option");
                            option2.text  = firstCharToLowerCase(jsonABI["functions"][i]["name"]);
                            option2.value = firstCharToLowerCase(jsonABI["functions"][i]["name"]);
                            inputboxjs2.add(option2);
                        }

                        for (var f = 0; f < jsonABI["functions"][i]["parameters"].length; f++)
                        {
                            textAbi += jsonABI["functions"][i]["parameters"][f]["type"] + " " +
                                jsonABI["functions"][i]["parameters"][f]["name"];
                            if( f != jsonABI["functions"][i]["parameters"].length - 1 )
                                textAbi += ", ";
                        }
                        textAbi += ");\n";
                    }
                    textAbi += "Events:" + "\n";
                    for (var e = 0; e < jsonABI["events"].length; e++)
                    {
                        textAbi += "\t" +
                            jsonABI["events"][e]["returntype"] + " " +
                            jsonABI["events"][e]["name"] + "(";
                        for (var f = 0; f < jsonABI["events"][e]["parameters"].length; f++)
                        {
                            textAbi += jsonABI["events"][e]["parameters"][f]["type"] + " " +
                                jsonABI["events"][e]["parameters"][f]["name"];
                            if( f != jsonABI["events"][e]["parameters"].length - 1 )
                                textAbi += ", ";
                        }
                        textAbi += ");\n";
                    }

                    console.log(codeabi);
                    $("#codeabi").val(textAbi);

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
                    $("#contractparams")[0].value = "\"\"";
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
								paramnames += jsonABI["functions"][i]["parameters"][j]["type"]+"\t";
                    }
						  if(paramhex.length > 0) {
                    		$("#contractparams")[0].value = paramhex;
						  		$("#contractparamsjs")[0].value = paramhex;
								$("#contractparamnamesjs")[0].value = paramnames;
						  }
						  else
						  		$("#contractparamnamesjs")[0].value = "no parameters";

                    // set invoke params to many empty strings (at least one is desirable for now)
						  // PYTHON
                    $("#invokeparams")[0].value = "\"\"";
						  for (j = 1; j < jsonABI["functions"][i]["parameters"].length; j++)
                        $("#invokeparams")[0].value += " \"\"";
						  // JS
						  $("#cbx_usearray_js")[0].checked = false;
						  if(paramhex=="0710") // enable array passing
						  		$("#cbx_usearray_js")[0].checked = true;
						  updateArrayInvokeParamsJs(); // update auxiliary check boxes
						  updateInvokeParamsJs(); // update simple example

                    // get return hexcode
                    rettype = jsonABI["functions"][i]["returntype"];
                    $("#contractreturn")[0].value = getHexForType(rettype);
                    $("#contractreturnjs")[0].value = getHexForType(rettype);
                }
            },
            "json" // The format the response should be in
        );  //End of POST for Compile

	//Send info to EcoServices for counting number of compilations
	$.post(
            BASE_PATH_ECOSERVICES + "/compileCounter", // Gets the URL to sent the post to
            null, // Serializes form data in standard format
            function (data) {
        },
            "json" // The format the response should be in
        );  //End of POST for Compile counter

    }); //End of form Compile function
    //===============================================================

    //===============================================================
    //Invoke JS
    $("#forminvokejs").submit(function (e) {
        //$("#contractmessages").text("");
        //$("#contractmessagesnotify").text("");
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this); // `this` refers to the current form element
        var indata = $(this).serialize();

	var wI = $("#wallet_invokejs")[0].selectedOptions[0].index;
	var attachgasfeejs = Number($("#attachgasfeejs").val());
	var attachsystemgasjs = Number($("#attachSystemgasjs").val());
	var attachneojs = Number($("#attachneojs").val());
	var attachgasjs = Number($("#attachgasjs").val());
	var invokeScripthash = $("#invokehashjs").val();

	var invokefunc = "";
	// INVOKE function is already passed as a String parameter!!

	//if($("#invokefunctionjs")[0].value != "Main")
	//	invokefunc = $("#invokefunctionjs")[0].value;

	var neonJSParams = [];
	neonJSParams = JSON.parse($("#invokeparamsjs")[0].value);

	InvokeFromAccount(wI,attachgasfeejs,attachsystemgasjs,attachneojs,attachgasjs, invokeScripthash, invokefunc, BASE_PATH_CLI, getCurrentNetworkNickname(), neonJSParams);

	//Send info to EcoServices for counting number of invokes
	$.post(
            BASE_PATH_ECOSERVICES + "/invokecounter", // Gets the URL to sent the post to
            null, // Serializes form data in standard format
            function (data) {
        },
            "json" // The format the response should be in
        );  //End of POST for Compile counter

    });//End of invoke function
    //===============================================================

    //===============================================================
    //Deploy JS
    $("#formdeployjs").submit(function (e) {
        //$("#contractmessages").text("");
        //$("#contractmessagesnotify").text("");
        e.preventDefault(); // Prevents the page from refreshing
        var $this = $(this); // `this` refers to the current form element
        var indata = $(this).serialize();
	var contractGasCost = 90;
	var wI = $("#wallet_deployjs")[0].selectedOptions[0].index;
	var storage = 0;

	var rT = $("#contractreturnjs").val();
	if($("#contractreturnjs").val()=="f0" || $("#contractreturnjs").val()=="ff")
		rT += "00"; // ff becomes 'ff00' (biginteger representation)

	var params = $("#contractparamsjs").val();

	//console.log("Parameter list: "+params);
	//console.log("Return type: "+rT);

	var script = $("#codeavm").val().replace(/(\r\n|\n|\r)/gm, "");

   console.log("Deploying contract: '"+script+"' scripthash: '"+$("#contracthashjs").val()+"' storage: '"+$("#cbx_storagejs").val()+"' di: '"+$("#cbx_dynamicinvokejs").val()+"' RT: '"+$("#contractreturnjs").val()+"' RT: '"+$("#contractreturnjs").val()+"' with params '"+$("#contractparamsjs").val()+"'");

	if($("#cbx_storagejs")[0].checked) {
		contractGasCost += 400;
		storage += 1;
	}

	if($("#cbx_dynamicinvokejs")[0].checked) {
		contractGasCost += 500;
		storage += 2;
	}

	if($("#cbx_ispayablejs")[0].checked) {
		storage += 4;
	}

	console.log("Final attached gas should be:" + contractGasCost)

	      var contract_name = $("#jsdeploy_name").val();
				var contract_desc = $("#jsdeploy_desc").val();
				var contract_email = $("#jsdeploy_email").val();
				var contract_author = $("#jsdeploy_author").val();
				var contract_version = $("#jsdeploy_version").val();

				//console.log(contract_name+contract_desc+contract_email+contract_author+contract_version);

        DeployFromAccount(wI,contractGasCost,BASE_PATH_CLI, getCurrentNetworkNickname(),script,storage,rT,params, contract_desc, contract_email, contract_author, contract_version, contract_name);

	//Send info to EcoServices for counting number of deploys
	$.post(
            BASE_PATH_ECOSERVICES + "/deploycounter", // Gets the URL to sent the post to
            null, // Serializes form data in standard format
            function (data) {
        },
            "json" // The format the response should be in
        );  //End of POST for Compile counter

    });//End of deploy function
    //===============================================================


    $("#formgetstorage").submit(function (e) {
        e.preventDefault(); // Prevents the page from refreshing
	//Clean previous storage values
        $("#gsf_contractvaluehex")[0].value = "";
	       $("#gsf_contractvaluestr")[0].value = "";

	//Get the hash and key
        sthash = $("#gsf_contracthash")[0].value;
        stkey = $("#gsf_contractkey")[0].value;
        if($("#getStorageFormat")[0].value == "String (no quotes)") {
			  stkey = Neon.u.str2hexstring(stkey);
		  }

        console.log("looking for storage key '"+stkey+"' at contract '"+sthash+"'" +" in the network "+$("#rpc_nodes_path")[0].value);
        getStorage(sthash, stkey, $("#rpc_nodes_path")[0].value).then(function(data){
            $("#gsf_contractvaluehex")[0].value = data.result;
            if(data.result != null)
              $("#gsf_contractvaluestr")[0].value = Neon.u.hexstring2str(data.result);
            else
            {
                $.post(
                    $("#rpc_nodes_path")[0].value, // Gets the URL to sent the post to
                    '{ "jsonrpc": "2.0", "id": 5, "method": "getcontractstate", "params": ["'+sthash+'"] }', // Serializes form data in standard format
                    function (data2) {
                      if(data2.result) { // contract exists
								 if(data2.result.properties.storage)
                             $("#gsf_contractvaluehex")[0].value = "contract exists (but key does not)!";
								 else
                             $("#gsf_contractvaluehex")[0].value = "contract exists (but did not pay for Storage on deploy)!";
							 }
                      else if(data2.error.code == -100)
                        $("#gsf_contractvaluehex")[0].value = "contract does not exist (must deploy first)!";
                      else {
                        $("#gsf_contractvaluehex")[0].value = "some strange error happened!";
                        console.log(data2);
                      }
                    },
                    "json" // The format the response should be in
                    ).fail(function() {
                      $("#gsf_contractvaluehex")[0].value = "failed to invoke network!";
                    }); //End of POST for search
            }
        });
    });//End of storage read function
    //===============================================================



    //===============================================================
    function createEditor(name, mode) {
        var editor = ace.edit(name);
        editor.setTheme("ace/theme/clouds");
        editor.session.setMode(mode);
        editor.setAutoScrollEditorIntoView(true);
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableSnippets: true,
            enableLiveAutocompletion: false,
            maxLines: 30
        });
        editor.commands.addCommand({
            name: "showKeyboardShortcuts",
            bindKey: {win: "Ctrl-Alt-h", mac: "Command-Alt-h"},
            exec: function (editor) {
                ace.config.loadModule("ace/ext/keybinding_menu", function (module) {
                    module.init(editor);
                    //editor.showKeyboardShortcuts() just shows when tigger the hotkey
                })
            }
        })
        return editor
    }

    //===============================================================

    //===============================================================
    $("#btn_downloadOpCode").click(function (e) {
        e.preventDefault();
        mydata = $('#formdeploy').contents().find('#opcodes').val();
        var file = new Blob([mydata],{type:'text/plain'});
        download(file, ".opcodes");
    });
    //===============================================================

    //===============================================================
    function ImportAVM() {
         var file = document.getElementById("importAVMFile").files[0];
         if (file) {
             var reader = new FileReader();
             reader.onloadend = function () {
                 var hex;

                 //Check if it is binary result
                 if (/[\x00-\x1F\x80-\xFF]/.test(this.result)) {
                   hex = bin2hex(this.result);
                 } else {
                   hex = this.result;
                 }

                 $("#codeavm").val(hex);
                 $("#opcodes").text("");
                 $("#codeabi").text("");
                 $("#codewarnerr").text("");

                 var hexavm = hex;
                 hexavm = hexavm.replace(/(\r\n|\n|\r)/gm, "");
                 //var shash = getScriptHashFromAVM(hexavm);
                 var bitshash160 = sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(hexavm)));
                 var shash = revertHexString(sjcl.codec.hex.fromBits(bitshash160));
                 //printOpcode(hexavm, $("#opcodes"));

					  $("#contracthash")[0].value = shash;
                 $("#invokehash")[0].value = shash;
					  $("#contracthashjs")[0].value = shash;
					  $("#invokehashjs")[0].value = shash;

					  // assuming canonical format
					  $("#contractparamsjs")[0].value = "0710"; // string array
					  $("#contractreturnjs")[0].value = "05"    // bytearray

                 console.log(toBase58(shash));//address
                 alert("scripthash "+shash+" imported successfully!");

             };
             reader.readAsBinaryString(file);
         }
    }
    //===============================================================

    function GetOpcodes() {
         console.log("disassembly opcodes...");
         $("#txt_opcodes").val("");
         hexavm = $("#codeavm").val();
         hexavm = hexavm.replace(/(\r\n|\n|\r)/gm, "");
         printOpcode(hexavm, $("#txt_opcodes"));
    }

    //===============================================================

    function setExample( selected_index ){
        console.log("selecting example:"+selected_index);

        editorCSharp.getSession().setValue("");

		  getfile(selected_index, 0);
		  /*
		  var numfiles = cSharpFiles[selected_index].length;
		  if(numfiles == 1) {
	        console.log("example file is: "+file);
		  } else {
			  var file_i = 0;
			  while(file_i < numfiles) {

			  }
		  }
		  */
    }

	 function getfile(selected_index, index=0) {
		 var numfiles = cSharpFiles[selected_index].length;
		 if(index < numfiles) {
		 	var file = cSharpFiles[selected_index][index];
			console.log("getting example file: "+file);
			$.get(file, function (data) {
			 	editorCSharp.getSession().setValue(editorCSharp.getSession().getValue() + data);
				getfile(selected_index, index+1);
			});
	 	 }
	 }
    //===============================================================

    //===============================================================
    function downloadAVM( selected_index ){
        console.log(selected_index);

        var file = new Blob();
        mydata = localStorage.getItem('avmFile');

        if( selected_index == 0 ) {
            mydata = hex2bin(mydata);
            mydatalist = new Array(mydata.length);
            for(var i = 0; i<mydata.length; i++)
                mydatalist[i] = mydata.charCodeAt(i);

            mybuf = new Uint8Array(mydatalist); // MAGIC???
            file = new Blob([mybuf],{type:'application/octet-stream'});//new Blob([data], {type: type});
        }
        else {
            file = new Blob([mydata],{type:'text/plain'});//new Blob([data], {type: type});
        }
        download(file, ".avm");
    };
    //===============================================================

    //===============================================================
    function buttonRemoveTX(idToRemove){
      if(idToRemove < vecRelayedTXs.length && idToRemove > -1)
      {
          vecRelayedTXs.splice(idToRemove, 1);
          drawRelayedTXs();
      }else{
        alert("Cannot remove TX with ID " + idToRemove + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
    }
    //===============================================================

    //===============================================================
    function drawRelayedTXs(){
    	//Clear previous data
    	document.getElementById("divRelayedTXs").innerHTML = "";
    	var table = document.createElement("table");
      table.setAttribute('class', 'table');
      table.style.width = '20px';

      var row = table.insertRow(-1);
      var headers1 = document.createElement('div');
      var headers2 = document.createElement('div');
      var headersTxType = document.createElement('div');
      var headerstxScriptHash = document.createElement('div');
      var headerstxParams = document.createElement('div');
      var headers4 = document.createElement('div');
      var headersAppLog = document.createElement('div');
      var headersRestore = document.createElement('div');
      headers1.innerHTML = "<b> ID </b>";
      row.insertCell(-1).appendChild(headers1);
      headersAppLog.innerHTML = "<b> VM Status (Click for Info)</b>";
      row.insertCell(-1).appendChild(headersAppLog);
      headersRestore.innerHTML = "<b> Restore </b>";
      row.insertCell(-1).appendChild(headersRestore);
      headersTxType.innerHTML = "<b> txType </b>";
      row.insertCell(-1).appendChild(headersTxType);
      headerstxScriptHash.innerHTML = "<b> txScriptHash </b>";
      row.insertCell(-1).appendChild(headerstxScriptHash);
      headerstxParams.innerHTML = "<b> txParams </b>";
      row.insertCell(-1).appendChild(headerstxParams);
      headers2.innerHTML = "<b> TX on NeoScan </b>";
      row.insertCell(-1).appendChild(headers2);


      for (i = 0; i < vecRelayedTXs.length; i++) {
          var txRow = table.insertRow(-1);
          //row.insertCell(-1).appendChild(document.createTextNode(i));
          //Insert button that remove rule
          var b = document.createElement('button');
          b.setAttribute('content', 'test content');
          b.setAttribute('class', 'btn btn-danger');
          b.setAttribute('value', i);
          //b.onclick = function () {buttonRemoveRule();};
          //b.onclick = function () {alert(this.value);};
          b.onclick = function () {buttonRemoveTX(this.value);};
          b.innerHTML = i;
          txRow.insertCell(-1).appendChild(b);

          var bGoToAppLog = document.createElement('button');
          bGoToAppLog.setAttribute('content', 'test content');
          bGoToAppLog.setAttribute('class', 'btn btn-info');
          bGoToAppLog.setAttribute('value', i);
          bGoToAppLog.setAttribute('id', "appLogNeoCli"+i);
          bGoToAppLog.onclick = function () {callAppLog(this.value);};
          bGoToAppLog.innerHTML = '?';
          txRow.insertCell(-1).appendChild(bGoToAppLog);

	  if(vecRelayedTXs[i].txType === "Invoke")
	  {
		  var bRestore = document.createElement('button');
		  bRestore.setAttribute('content', 'test content');
		  bRestore.setAttribute('class', 'btn btn-info');
		  bRestore.setAttribute('value', i);
		  bRestore.onclick = function () {restoreInvokeTX(this.value);};
		  bRestore.innerHTML = 'R_I';
		  txRow.insertCell(-1).appendChild(bRestore);
	  }else{
		  var bRestore = document.createElement('button');
		  bRestore.setAttribute('content', 'test content');
		  bRestore.setAttribute('class', 'btn btn-info');
		  bRestore.setAttribute('value', i);
		  bRestore.onclick = function () {restoreDeployTX(this.value);};
		  bRestore.innerHTML = 'R_D';
		  txRow.insertCell(-1).appendChild(bRestore);
	  }


          var inputTxType = document.createElement("input");
          //input.setAttribute("type", "hidden");
          inputTxType.setAttribute("name", "textTxType"+i);
          inputTxType.setAttribute("readonly","true");
          inputTxType.style.width = '70px';
          inputTxType.setAttribute("value", vecRelayedTXs[i].txType);
          txRow.insertCell(-1).appendChild(inputTxType);

          var inputSH = document.createElement("input");
          //input.setAttribute("type", "hidden");
          inputSH.setAttribute("name", "textScriptHash"+i);
          inputSH.setAttribute("readonly","true");
          inputSH.style.width = '120px';
          inputSH.setAttribute("value", vecRelayedTXs[i].txScriptHash);
          txRow.insertCell(-1).appendChild(inputSH);


          var inputParams = document.createElement("input");
          //input.setAttribute("type", "hidden");
          inputParams.setAttribute("name", "textParams"+i);
          inputParams.setAttribute("readonly","true");
          inputParams.setAttribute("value", vecRelayedTXs[i].txParams);
          txRow.insertCell(-1).appendChild(inputParams);

	  /*
          //Check activation status
          var activationStatus = document.createElement('div');
          activationStatus.setAttribute('id', "activationStatus"+i);
          activationStatus.innerHTML = "-";
          txRow.insertCell(-1).appendChild(activationStatus);
	  */

          var txIDCell = document.createElement("a");
          var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[i].tx;
          txIDCell.text = vecRelayedTXs[i].tx.slice(0,5) + "..." + vecRelayedTXs[i].tx.slice(-5);
          txIDCell.href = urlToGet;
          txIDCell.target = '_blank';
          txIDCell.onclick = urlToGet;
          txIDCell.style.width = '70px';
	  txIDCell.style.display = 'block';
          txRow.insertCell(-1).appendChild(txIDCell);


          //This draw can be deprecated
          /*$.getJSON(urlToGet, function(result) {
              //console.log(result);
              if(result.txid == "not found" || result.vin == null){
                activationStatus.innerHTML = "<font color=\"blue\">PENDING</font>";
              }else{
                activationStatus.innerHTML = "<font color=\"green\">FOUND</font>";
              }
          }).fail(function (result) {
              activationStatus.innerHTML = "<font color=\"red\">FAILED</font>";
          });*/


          //Check activation status ends
    	}//Finishes loop that draws each relayed transaction

      document.getElementById("divRelayedTXs").appendChild(table);
      searchForTXs();
    }//Finishe DrawRules function
   //===============================================================

   //===============================================================
   //Update vector of relayed txs
   function updateVecRelayedTXsAndDraw(relayedTXID, actionType, txScriptHash, txParams)
   {
	   vecRelayedTXs.push({tx:relayedTXID, txType:actionType, txScriptHash:txScriptHash, txParams:txParams});
           drawRelayedTXs();
   }
   //===============================================================

   //===============================================================
   //Call app log
   function callAppLog(txID){
      if(txID < vecRelayedTXs.length && txID > -1)
      {
	     var txHash = vecRelayedTXs[txID].tx;
	     var appLogJson = [];
	     appLogJson.push({"jsonrpc": "2.0", "id": 5, "method": "getapplicationlog", "params": [vecRelayedTXs[txID].tx] });
	     $("#txtRPCJson").val(JSON.stringify(appLogJson));
	     $('#btnCallJsonRPC').click();
	     //$("#pillstab").children().eq(2).find('a').tab('show');
	     document.getElementById('divFormJsonOut').scrollIntoView();
      }else{
        alert("Cannot get log of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
   }
  //===============================================================

  //===============================================================
   //Restore Invoke tx
   function restoreInvokeTX(txID){
      if(txID < vecRelayedTXs.length && txID > -1)
      {
	     if(vecRelayedTXs[txID].txType === "Invoke")
	     {
		var invokeJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
	     	$("#invokehashjs").val(vecRelayedTXs[txID].txScriptHash);
	     	$("#invokeparamsjs").val(JSON.stringify(invokeJsonParams.neonJSParams));
		$("#attachgasfeejs").val(invokeJsonParams.mynetfee);
		$("#attachSystemgasjs").val(invokeJsonParams.mysysgasfee);
		$("#attachneojs").val(invokeJsonParams.neo);
		$("#attachgasjs").val(invokeJsonParams.gas);
		if(searchAddrIndexFromBase58(invokeJsonParams.caller) != -1)
			$("#wallet_invokejs")[0].selectedIndex = searchAddrIndexFromBase58(invokeJsonParams.caller);
	     }
      }else{
        alert("Cannot restore invoke of TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
   }

   function restoreDeployTX(txID){
      if(txID < vecRelayedTXs.length && txID > -1)
      {
	     if(vecRelayedTXs[txID].txType === "Deploy")
	     {

		var deployJsonParams = JSON.parse(vecRelayedTXs[txID].txParams);
		console.log(deployJsonParams);
	     	$("#jsdeploy_name").val(deployJsonParams.contract_appname);
	     	$("#jsdeploy_desc").val(deployJsonParams.contract_description);
		$("#jsdeploy_email").val(deployJsonParams.contract_email);
		$("#jsdeploy_author").val(deployJsonParams.contract_author);
		$("#jsdeploy_version").val(deployJsonParams.contract_version);
		$("#contractparamsjs").val(deployJsonParams.par);
		$("#codeavm").val(deployJsonParams.contract_script);
		$("#contracthashjs").val(getScriptHashFromAVM(deployJsonParams.contract_script));
                $("#contractreturn")[0].value = getHexForType(deployJsonParams.returntype);
                $("#contractreturnjs")[0].value = getHexForType(deployJsonParams.returntype);

		if(deployJsonParams.storage == 0)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 1)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 2)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 3)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = false;
		}
		if(deployJsonParams.storage == 4)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = true;
		}
		if(deployJsonParams.storage == 5)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = false;
			$("#cbx_ispayablejs")[0].checked = true;
		}
		if(deployJsonParams.storage == 6)
		{
			$("#cbx_storagejs")[0].checked = false;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = true;
		}
		if(deployJsonParams.storage == 7)
		{
			$("#cbx_storagejs")[0].checked = true;
			$("#cbx_dynamicinvokejs")[0].checked = true;
			$("#cbx_ispayablejs")[0].checked = true;
		}


		if(searchAddrIndexFromBase58(deployJsonParams.caller) != -1)
			$("#wallet_deployjs")[0].selectedIndex = searchAddrIndexFromBase58(deployJsonParams.caller);

	     }

      }else{
        alert("Cannot restore deploy TX with ID " + txID + " from set of relayed transactions with size " + vecRelayedTXs.length)
      }
   }
   //===============================================================

  //===============================================================
   //This function tries to search and verify for all relayed TXs that were, possible, broadcasted and included in the blockchain
   function searchForTXs(){
     //console.log("Searching tx's");
     for (i = 0; i < vecRelayedTXs.length; i++)
      searchForTX(i);
   }

   function exportHistory(){
	console.log(JSON.stringify(vecRelayedTXs));
   }

   function loadHistory(vecRelayedTXsToLoad){	
	vecRelayedTXs = vecRelayedTXsToLoad;
        drawRelayedTXs();
   }


   //===============================================================

   //===============================================================
   //This function tries to search and verify for a specific relayed TX that was, possible, broadcasted and included in the blockchain
   function searchForTX(indexToUpdate){

          //DEPRECATED QUERY FOR CHECKING IF FOUND ON NEOSCAN AND LINK TO Logs from csharp docker container
	  /*
          $.getJSON(BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[indexToUpdate].tx, function(result) {
              //console.log("div is activationStatus"+indexToUpdate);
              if(result.txid == "not found" || result.vin == null){
                document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"blue\">PENDING</font>";
              }else{
                document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"green\">FOUND</font><a target='_blank' href='txnotifications?txid="+vecRelayedTXs[indexToUpdate].tx+"'>(logs)</a>";
              }
          }).fail(function (result) {
              document.getElementById("activationStatus"+indexToUpdate).innerHTML = "<font color=\"red\">FAILED</font>";
          });
	  */

	  var jsonDataToCallNeoCli = [];
	  jsonDataToCallNeoCli.push({"jsonrpc": "2.0", "id": 5, "method": "getapplicationlog", "params": [vecRelayedTXs[indexToUpdate].tx] });

          $.post(
                BASE_PATH_CLI, // Gets the URL to sent the post to
                JSON.stringify(jsonDataToCallNeoCli), // Serializes form data in standard format
                function (data) {
		   //console.log(data);
		   if(data[0].result){
            if(data[0].result.vmstate) // 2.X
				     document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].result.vmstate;
				else
	              document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].result.executions[0].vmstate;
		   }else{
			   document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = data[0].error.code;
		   }
                },
                "json" // The format the response should be in
            ).fail(function() {
                document.getElementById("appLogNeoCli"+indexToUpdate).innerHTML = "FAILED";
          }); //End of POST for search
   }
  //===============================================================

   //===============================================================
   function convertParam(type, value) {
     if(type == "String")
        return "\""+value+"\"";
     if(type == "Address")
        return "\""+value+"\"";
     if(type == "Hex")
        return "b'"+Neon.u.str2hexstring(Neon.u.hexstring2str(value))+"'";
     if(type == "Integer")
        return ""+Number(value);
     return "";
   }
   //===============================================================

//===============================================================
   // self update python invoke parameters
   function updateInvokeParamsPy() {
     invokecmd = "";
     if($("#invokefunctionpy")[0].value != "Main")
        invokecmd += $("#invokefunctionpy")[0].value +" "; // method or "abcdef01" (method in hex with double slashes using Neon.u.str2hexstring...)

     countparam = 0;
     par1 = "";
     if($("#invokeparampybox1")[0].value != "None") {
        par1 = convertParam($("#invokeparampybox1")[0].value, $("#invokeparamspy1")[0].value);
        countparam++;
     }
     par2 = "";
     if($("#invokeparampybox2")[0].value != "None") {
        par2 = convertParam($("#invokeparampybox2")[0].value, $("#invokeparamspy2")[0].value);
        countparam++;
     }
     par3 = "";
     if($("#invokeparampybox3")[0].value != "None") {
        par3 = convertParam($("#invokeparampybox3")[0].value, $("#invokeparamspy3")[0].value);
        countparam++;
     }

     // put non-array values
     //if(!$("#cbx_inarray_py1")[0].checked)

      invokecmd += "[";
      if(par1 != "") {
         invokecmd += par1;
         countparam--;
      }
      if(countparam > 0)
         invokecmd += ",";
      if(par2 != "") {
         invokecmd += par2;
         countparam--;
      }
      if(countparam > 0)
         invokecmd += ",";
      if(par3 != "") {
         invokecmd += par3;
         countparam--;
      }
      invokecmd += "]";

      $("#invokeparams")[0].value = invokecmd;
   }
//===============================================================

//===============================================================
// self update neonjs invoke parameters (in json format)
   function updateInvokeParamsJs() {
     //console.log("updating js json...");
     invokefunc = "";
     if($("#invokefunctionjs")[0].value != "Main")
        invokefunc = $("#invokefunctionjs")[0].value; // method
	  var arrayparam = [];

     //console.log("function is "+invokefunc);
     var neonJSParams = [];

	  if(invokefunc != "")
	      pushParams(neonJSParams, "String", invokefunc);

     if($("#invokeparamjsbox1")[0].value != "None") {
		  if($("#cbx_inarray_js1")[0].checked)
		  		pushParams(arrayparam, $("#invokeparamjsbox1")[0].value, $("#invokeparamsjs1")[0].value);
		  else
        		pushParams(neonJSParams, $("#invokeparamjsbox1")[0].value, $("#invokeparamsjs1")[0].value);
     }
     if($("#invokeparamjsbox2")[0].value != "None") {
		  if($("#cbx_inarray_js2")[0].checked)
		  		pushParams(arrayparam, $("#invokeparamjsbox2")[0].value, $("#invokeparamsjs2")[0].value);
		  else
        		pushParams(neonJSParams, $("#invokeparamjsbox2")[0].value, $("#invokeparamsjs2")[0].value);
     }
     if($("#invokeparamjsbox3")[0].value != "None") {
		  if($("#cbx_inarray_js3")[0].checked)
		  		pushParams(arrayparam, $("#invokeparamjsbox3")[0].value, $("#invokeparamsjs3")[0].value);
		  else
        		pushParams(neonJSParams, $("#invokeparamjsbox3")[0].value, $("#invokeparamsjs3")[0].value);
     }

	  if($("#cbx_usearray_js")[0].checked)
	  		pushParams(neonJSParams, 'Array', arrayparam);

      $("#invokeparamsjs")[0].value = JSON.stringify(neonJSParams);
   }

   // block and unblock array checkboxes
	function updateArrayInvokeParamsJs() {
		if($("#cbx_usearray_js")[0].checked) {
			$("#cbx_inarray_js1")[0].checked = true;
			$("#cbx_inarray_js1")[0].disabled = false;
			$("#cbx_inarray_js2")[0].checked = true;
			$("#cbx_inarray_js2")[0].disabled = false;
			$("#cbx_inarray_js3")[0].checked = true;
			$("#cbx_inarray_js3")[0].disabled = false;
		}
		else {
			$("#cbx_inarray_js1")[0].checked = false;
			$("#cbx_inarray_js1")[0].disabled = true;
			$("#cbx_inarray_js2")[0].checked = false;
			$("#cbx_inarray_js2")[0].disabled = true;
			$("#cbx_inarray_js3")[0].checked = false;
			$("#cbx_inarray_js3")[0].disabled = true;
		}
	}
// ==============================================================
