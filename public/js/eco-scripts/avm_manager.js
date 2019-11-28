//===============================================================
function ImportAVM() {
    var file = document.getElementById("importAVMFile").files[0];
    if (file) {
        var reader = new FileReader();
        reader.onloadend = function() {
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
            $("#invokehashjs").val("");
            $("#contracthashjs").val("");
            $("#contractparams").val("\"\"");

            var hexavm = hex;
            hexavm = hexavm.replace(/(\r\n|\n|\r)/gm, "");
            //var shash = getScriptHashFromAVM(hexavm);
            var bitshash160 = sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(hexavm)));
            var shash = revertHexString(sjcl.codec.hex.fromBits(bitshash160));
            //printOpcode(hexavm, $("#opcodes"));

            updateScriptHashesBoxes(shash);
	    var avmSize = Math.ceil(hexavm.length/2);

            updateCompiledOrLoadedContractInfo(shash,avmSize);

            // assuming canonical format
            $("#contractparamsjs")[0].value = "0710"; // string array
            $("#contractreturnjs")[0].value = "05" // bytearray

            console.log(toBase58(shash)); //address
            alert("scripthash " + shash + " imported successfully!");

        };
        reader.readAsBinaryString(file);
    }
}


//===============================================================
function downloadAVM(selected_index) {
    console.log(selected_index);

    var file = new Blob();
    mydata = localStorage.getItem('avmFile');

    if (selected_index == 0) {
        mydata = hex2bin(mydata);
        mydatalist = new Array(mydata.length);
        for (var i = 0; i < mydata.length; i++)
            mydatalist[i] = mydata.charCodeAt(i);

        mybuf = new Uint8Array(mydatalist); // MAGIC???
        file = new Blob([mybuf], {
            type: 'application/octet-stream'
        }); //new Blob([data], {type: type});
    } else {
        file = new Blob([mydata], {
            type: 'text/plain'
        }); //new Blob([data], {type: type});
    }
    download(file, ".avm");
};
//===============================================================
