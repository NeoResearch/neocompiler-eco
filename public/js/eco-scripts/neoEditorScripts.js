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
		  const a = new fixed8FromHex(revertHexString(valfixed8));
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

	$('.nav-pills a[data-target="#activity"]').tab('show');
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

	var attachDeploygasfeejs = Number($("#attachDeployGasFeeJS").val());

        DeployFromAccount(wI,attachDeploygasfeejs,contractGasCost,BASE_PATH_CLI, getCurrentNetworkNickname(),script,storage,rT,params, contract_desc, contract_email, contract_author, contract_version, contract_name);

	//Send info to EcoServices for counting number of deploys
	$.post(
            BASE_PATH_ECOSERVICES + "/deploycounter", // Gets the URL to sent the post to
            null, // Serializes form data in standard format
            function (data) {
        },
            "json" // The format the response should be in
        );  //End of POST for Compile counter

	$('.nav-pills a[data-target="#activity"]').tab('show');
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
			  stkey = str2hexstring(stkey);
		  }

        console.log("looking for storage key '"+stkey+"' at contract '"+sthash+"'" +" in the network "+$("#rpc_nodes_path")[0].value);
        getStorage(sthash, stkey, $("#rpc_nodes_path")[0].value).then(function(data){
            $("#gsf_contractvaluehex")[0].value = data.result;
            if(data.result != null)
              $("#gsf_contractvaluestr")[0].value = hexstring2str(data.result);
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

    //===============================================================
    function ImportHistoricalActivityJSON() {
         var file = document.getElementById("importActivityFile").files[0];
         if (file) {
             var reader = new FileReader();
             reader.onloadend = function () {
		 var activityHistory = this.result;
		 console.log("Printing historical transactions to be loaded...")
                 console.log(activityHistory);
		 console.log(JSON.parse(activityHistory));
		 loadHistory(JSON.parse(activityHistory));
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
   // self update python invoke parameters
   function updateInvokeParamsPy() {
     invokecmd = "";
     if($("#invokefunctionpy")[0].value != "Main")
        invokecmd += $("#invokefunctionpy")[0].value +" "; // method or "abcdef01" (method in hex with double slashes using str2hexstring...)

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
