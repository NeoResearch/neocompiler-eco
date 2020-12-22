function createCompilexJson(code_cs) {
    var compilexJson = new Object();
    compilexJson.compilers_versions = $("#compilers_versions-selection-box")[0].value;
    compilexJson.codesend_selected_compiler = $("#codesend_selected_compiler")[0].value;
    compilexJson.cbx_compatible = 1;
    compilexJson.codesend = code_cs;
    return compilexJson;
}

function compilerCall() {
    $("#codewarnerr").val("Remote compiling at " + BASE_PATH_COMPILERS + "...");
    $("#compilebtn")[0].disabled = true;
    code_cs = "";
    $("#codeavm").val("");
    $("#opcodes").val("");
    $("#codeabi").val("");
    $("#codemanifest").val("");
    $("#invokehashjs").val("");
    $("#contracthashjs").val("");
    $("#contractparams").val("\"\"");
    $("#selected_compiler_form").val(SELECTED_COMPILER);

    //e.preventDefault(); // Prevents the page from refreshing
    var zip = new JSZip();
    zip.file("contract", ace.edit("aceEditor").getSession().getValue());
    zip.generateAsync({
        type: "base64",
        compression: "DEFLATE",
        compressionOptions: {
            level: 9
        }
    }).then((code) => {
        if (SELECTED_COMPILER == "csharp") {
            code_cs = code;
            console.log("Compiling C# code...");
        }
        var indata = createCompilexJson(code_cs);
        console.log(indata)
        $.post(
                BASE_PATH_COMPILERS + "/compilex", // Gets the URL to sent the post to
                indata, // Serializes form data in standard format
                function(data) {
                    console.log("finished compiling");
                    console.log(data);
                    $("#compilebtn")[0].disabled = false;
                    var coderr = atob(data.output);
                    $("#codewarnerr").val(coderr);
                    var hexcodeavm = atob(data.avm);
                    $("#codeavm").val(hexcodeavm);
                    hexcodeavm = hexcodeavm.replace(/(\r\n|\n|\r)/gm, "");
                    $("#opcodes").val("");
                    //printOpcode(hexcodeavm, $("#opcodes"));
                    //console.log("GRAVANDO BINARIO: "+typeof(datacontent)+":"+datacontent);
                    localStorage.setItem('avmFile', hexcodeavm); //, {type: 'application/octet-stream'});
                    //datacontent = localStorage.getItem('avmFile', {type: 'application/octet-stream'});
                    //console.log("LENDO BINARIO: "+typeof(datacontent)+":"+datacontent);
                    //console.log(localStorage.getItem('avmFile').charCodeAt(0));
                    //$("#btn_download")[0].style = "";

                    //filling hashes
                    var contractScriptHash = getScriptHashFromAVM(hexcodeavm);
                    var avmSize = Math.ceil(hexcodeavm.length / 2);
                    updateCompiledOrLoadedContractInfo(contractScriptHash, avmSize);

                    // Loading Manifest Info
                    console.log("loading manifest");
                    if (data.manifest != "") {
                        var textmanifest = atob(data.manifest);
                        $("#codemanifest").val(textmanifest);
                    }

                    // Loading all ABI related boxes
                    if (data.abi != "") {
                        var codeabi = atob(data.abi);
                        updateAllABIDependencies(JSON.parse(codeabi));
                    }

                },
                "json" // The format the response should be in
            ).done(function() { alert('Request done!'); })
            .fail(function(jqxhr, settings, ex) {
                alert('failed, ' + ex);
                console.log(jqxhr);
                console.log(settings);
                $("#compilebtn")[0].disabled = false;
                var coderr = atob(data.output);
                $("#codewarnerr").val(coderr);
                var hexcodeavm = atob(data.avm);
                $("#codeavm").val(hexcodeavm);
                hexcodeavm = hexcodeavm.replace(/(\r\n|\n|\r)/gm, "");
                $("#opcodes").val("");
            });

        //Send info to EcoServices for counting number of compilations
        $.post(
            BASE_PATH_ECOSERVICES + "/compileCounter", // Gets the URL to sent the post to
            null, // Serializes form data in standard format
            function(data) {},
            "json" // The format the response should be in
        ); //End of POST for Compile counter
    });
}

function updateCompiledOrLoadedContractInfo(contractScriptHash, avmSize) {
    $("#contractInfo_ScriptHash")[0].value = contractScriptHash;
    $("#contractInfo_Address")[0].value = toBase58(contractScriptHash);
    //TODO
    //updateScriptHashesBoxes(contractScriptHash);

    // ------------------------------------------
    // calculating extra fee according to AVM size
    var fixedAVGTxSize = 500; //TODO
    $("#contractInfo_AVMSize")[0].value = avmSize;
    // TODO - Create a call on neo-plugins SimplePolicy
    var freeSize = 1024;
    var feePerExtraByte = 0.00001;
    var extraGasNetFeeForBigTx = 0;
    // TODO Extra size workaround due to inputs lenght
    var avmWithExtraSize = avmSize + fixedAVGTxSize;
    if (avmWithExtraSize > freeSize)
        extraGasNetFeeForBigTx = (avmWithExtraSize - freeSize) * feePerExtraByte;
    $("#attachDeployGasFeeJS")[0].value = Number(String(extraGasNetFeeForBigTx).slice(0, 10));
    // ------------------------------------------
}