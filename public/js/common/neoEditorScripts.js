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
		      $("#neonodeurl")[0].value, // Gets the URL to sent the post to
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
            BASE_ANGULARJS_PATH + $this.attr("action"), // Gets the URL to sent the post to
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

                    var textAbi = "ScriptHash (reversed): " + jsonABI["hash"] + "\n";
                    textAbi += "Entry Point:" + jsonABI["entrypoint"] + "\n";
                    textAbi += "Functions:" + "\n";

                    for (var i = 0; i < jsonABI["functions"].length; i++)
                    {
                        textAbi += "\t" +
                            jsonABI["functions"][i]["returntype"] + " " +
                            jsonABI["functions"][i]["name"] + "(";

                        if(jsonABI["functions"][i]["name"] != "Main") {
                            option = document.createElement("option");
                            option.text  = jsonABI["functions"][i]["name"];
                            option.value = jsonABI["functions"][i]["name"];
                            inputbox2.add(option);
                            option2 = document.createElement("option");
                            option2.text  = jsonABI["functions"][i]["name"];
                            option2.value = jsonABI["functions"][i]["name"];
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
                    console.log("Parsing ABI json");
                    // look for Main function
                    var i = 0;
                    for (i = 0; i < jsonABI["functions"].length; i++)
                        if (jsonABI["functions"][i]["name"] == "Main") {
                            console.log("Found function 'Main' with id=" + i);
                            break;
                        }

                    // get parameters
                    $("#contractparams")[0].value = "\"\"";
						  $("#contractparamsjs")[0].value = "";
                    var j = 0;
                    console.log("Parameter count:" + jsonABI["functions"][i]["parameters"].length);
						  var paramhex = "";
                    for (j = 0; j < jsonABI["functions"][i]["parameters"].length; j++) {
                        var phex = getHexForType(jsonABI["functions"][i]["parameters"][j]["type"]);
                        console.log("parameter[" + j + "]: " + jsonABI["functions"][i]["parameters"][j]["type"] + " -> hex(" + phex + ")");
                        paramhex += phex;
                    }
						  if(paramhex.length > 0) {
                    		$("#contractparams")[0].value = paramhex;
						  		$("#contractparamsjs")[0].value = paramhex;
						  }
                    // set invoke params to many empty strings (at least one is desirable for now)
                    $("#invokeparams")[0].value = "\"\"";
						  $("#invokeparamsjs")[0].value = "\"\"";
                    for (j = 1; j < jsonABI["functions"][i]["parameters"].length; j++) {
                        $("#invokeparams")[0].value += " \"\"";
								$("#invokeparamsjs")[0].value += " \"\"";
						  }
                    // get return hexcode
                    rettype = jsonABI["functions"][i]["returntype"];
                    $("#contractreturn")[0].value = getHexForType(rettype);
                    $("#contractreturnjs")[0].value = getHexForType(rettype);
                }
            },
            "json" // The format the response should be in
        );  //End of POST for Compile

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
	var attachneojs = Number($("#attachneojs").val());
	var attachgasjs = Number($("#attachgasjs").val());
	var invokeScripthash = $("#invokehashjs").val();
     
	var invokefunc = "";
	if($("#invokefunctionjs")[0].value != "Main")
		invokefunc = $("#invokefunctionjs")[0].value;

	var neonJSParams = [];
	neonJSParams = JSON.parse($("#invokeparamsjs")[0].value);

	Invoke(KNOWN_ADDRESSES[wI].publicKey,KNOWN_ADDRESSES[wI].privateKey,attachgasfeejs,attachneojs,attachgasjs, invokeScripthash, invokefunc, BASE_PATH_CLI, getCurrentNetworkNickname(), neonJSParams);

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

	console.log("Final attached gas should be:" + contractGasCost)

        Deploy(KNOWN_ADDRESSES[wI].publicKey,KNOWN_ADDRESSES[wI].privateKey,contractGasCost,BASE_PATH_CLI, getCurrentNetworkNickname(),script,storage,rT,params)
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
        if($("#getStorageFormat")[0].value == "String (no quotes)")
           stkey = Neon.u.str2hexstring(stkey);

        console.log("looking for storage key '"+stkey+"' at contract '"+sthash+"'" +" in the network "+$("#neonodeurl")[0].value);
        getStorage(sthash, stkey, $("#neonodeurl")[0].value).then(function(data){
            $("#gsf_contractvaluehex")[0].value = data.result;
            if(data.result != null)
              $("#gsf_contractvaluestr")[0].value = Neon.u.hexstring2str(data.result);
            else
            {
                $.post(
                    $("#neonodeurl")[0].value, // Gets the URL to sent the post to
                    '{ "jsonrpc": "2.0", "id": 5, "method": "getcontractstate", "params": ["'+sthash+'"] }', // Serializes form data in standard format
                    function (data2) {
                      if(data2.result)
                        $("#gsf_contractvaluehex")[0].value = "contract exists!";
                      else if(data2.error.code == -100)
                        $("#gsf_contractvaluehex")[0].value = "contract does not exist!";
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
                 //$("#contracthash_search")[0].value = $("#contracthash")[0].value;
                 $("#invokehash")[0].value = $("#contracthash")[0].value;

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
      var headers3 = document.createElement('div');
      var headers4 = document.createElement('div');
      headers1.innerHTML = "<b> ID </b>";
      row.insertCell(-1).appendChild(headers1);
      headers2.innerHTML = "<b> TX </b>";
      row.insertCell(-1).appendChild(headers2);
      headers3.innerHTML = "<b> Note </b>";
      row.insertCell(-1).appendChild(headers3);
      headers4.innerHTML = "<b> Blockchained </b>";
      row.insertCell(-1).appendChild(headers4);

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

          var txIDCell = document.createElement("a");
          var urlToGet = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_transaction/" + vecRelayedTXs[i].tx;
          txIDCell.text = vecRelayedTXs[i].tx.slice(0,5) + "..." + vecRelayedTXs[i].tx.slice(-5);
          txIDCell.href = urlToGet;
          txIDCell.target = '_blank';
          txIDCell.onclick = urlToGet;
          txIDCell.style.width = '70px';
	  txIDCell.style.display = 'block';
          txRow.insertCell(-1).appendChild(txIDCell);

          var input = document.createElement("input");
          //input.setAttribute("type", "hidden");
          input.setAttribute("name", "textNote"+i);
          input.setAttribute("value", vecRelayedTXs[i].note);
          txRow.insertCell(-1).appendChild(input);

          //Check activation status
          var activationStatus = document.createElement('div');
          activationStatus.setAttribute('id', "activationStatus"+i);
          activationStatus.innerHTML = "-";

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

          txRow.insertCell(-1).appendChild(activationStatus);
          //Check activation status ends
    	}//Finishes loop that draws each relayed transaction

      document.getElementById("divRelayedTXs").appendChild(table);
      searchForTXs();
    }//Finishe DrawRules function
   //===============================================================

  //===============================================================
   //This function tries to search and verify for all relayed TXs that were, possible, broadcasted and included in the blockchain
   function searchForTXs(){
     //console.log("Searching tx's");
     for (i = 0; i < vecRelayedTXs.length; i++)
      searchForTX(i);
   }
   //===============================================================

   //===============================================================
   //This function tries to search and verify for a specific relayed TX that was, possible, broadcasted and included in the blockchain
   function searchForTX(indexToUpdate){
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
     console.log("updating js json...");
     invokefunc = "";
     if($("#invokefunctionjs")[0].value != "Main")
        invokefunc = $("#invokefunctionjs")[0].value; // method

     console.log("function is "+invokefunc);
     var neonJSParams = [];
     countparam = 0;
     if($("#invokeparamjsbox1")[0].value != "None") {
        pushParams(neonJSParams, $("#invokeparamjsbox1")[0].value, $("#invokeparamsjs1")[0].value);
        countparam++;
	console.log("step1");
     }
     if($("#invokeparamjsbox2")[0].value != "None") {
        pushParams(neonJSParams, $("#invokeparamjsbox2")[0].value, $("#invokeparamsjs2")[0].value);
        countparam++;
	console.log("step2");
     }
     if($("#invokeparamjsbox3")[0].value != "None") {
        pushParams(neonJSParams, $("#invokeparamjsbox3")[0].value, $("#invokeparamsjs3")[0].value);
        countparam++;
	console.log("step3");
     }

	  invokecmd = "";
	  //invokecmd += invokefunc;
	  //invokecmd += " ";

      invokecmd += JSON.stringify(neonJSParams);

      $("#invokeparamsjs")[0].value = invokecmd;
   }
// ==============================================================
