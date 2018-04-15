function download(file, ext){
    var d = new Date();
    var n = d.getTime();
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, n + ext);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = n + ext;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
}

function hex2bin(hex) {
    var bytes = [];
    for (var i = 0; i < hex.length - 1; i += 2)
        bytes.push(parseInt(hex.substr(i, 2), 16));
    str = String.fromCharCode.apply(String, bytes);
    return str;
}

function bin2hex(bin)
{
    var hex = "";
    for (var i = 0; i < bin.length; i++) {
        var byteStr = bin.charCodeAt(i).toString(16);
        if (byteStr.length < 2) {
            byteStr = "0" + byteStr;
        }
        if( i > 0  && i % 30 == 0 )
            hex += "\n";
        hex += byteStr;
    }
    return hex;
}
// https://github.com/neo-project/neo/blob/master/neo/SmartContract/ContractParameterType.cs
// https://github.com/CityOfZion/neo-python/blob/master/neo/SmartContract/ContractParameterType.py
function getHexForType(stype) {
    if (stype == "Signature")
        return '00';
    else if (stype == "Boolean")
        return '01';
    else if (stype == "Integer")
        return '02';
    else if (stype == "Hash160")
        return '03';
    else if (stype == "Hash256")
        return '04';
    else if (stype == "ByteArray")
        return '05';
    else if (stype == "PublicKey")
        return '06';
    else if (stype == "String")
        return '07';
    else if (stype == "Array")
        return '10'; // object[]
    else if (stype == "InteropInterface")
        return 'f0';
    else if (stype == "Void")
        return 'ff';
    else
        return '05';
}

function hex2int(hex) {
    var bigint = BigInteger(0);
    bigint = bigint.add(parseInt(hex.substr(i, 2), 16));
    for (var i = 2; i < hex.length - 1; i += 2)
        bigint = bigint.multiply(256).add(parseInt(hex.substr(i, 2), 16));
    return bigint;
}

function revertHexString(hex) {
    var reverthex = "";
    for (var i = 0; i < hex.length - 1; i += 2)
        reverthex = "" + hex.substr(i, 2) + reverthex;
    return reverthex;
}

function toBase58(data)
{
    var hexdata = "17" + revertHexString(data);
    console.log( hexdata );
    var bitchecksum = sjcl.hash.sha256.hash(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(hexdata)));
    console.log( sjcl.codec.hex.fromBits(bitchecksum) );
    var cut = bitchecksum.slice(0,1);
    console.log( sjcl.codec.hex.fromBits(cut) );
    var buffer = hexdata + sjcl.codec.hex.fromBits(cut);
    console.log( buffer );
    return Base58Encode(buffer);
}

function Base58Encode(input)
{
    var Alphabet = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";
    var value = BigInteger(hex2int(input));
    var sb = "";
    while (value >= 58)
    {
        var mod = value.remainder(58);
        sb = ""+Alphabet.charAt(mod)+sb;
        value = value.divide(58);
    }
    sb = ""+Alphabet.charAt(value)+sb;
    console.log( sb );
    for (var i = 0; i < input.length - 1; i += 2)
    {
        if (input.substr(i, 2) == "00")
            sb = ""+Alphabet.charAt(0)+sb;
        else
            break;
    }
    console.log( sb );
    return sb;
}

// Calculate gas cost
//https://github.com/neo-project/docs/blob/master/en-us/sc/systemfees.md
// https://github.com/neo-project/neo-vm/blob/master/src/neo-vm/OpCode.cs
function parseOpcode(opcode, hexavm, target) {
    var pvalue = parseInt(opcode, 16);
    if (opcode == "00")
        target.text(target.text() + opcode + "\tPUSH0\t#An empty array of bytes is pushed onto the stack\n");
    else if ((pvalue >= 1) && (pvalue <= 75)) {
        target.text(target.text() + opcode + "\tPUSHBYTES" + pvalue + "\t # ");
        var i = 0;
        var spush = "";
        for (i = 0; i < pvalue; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.text(target.text() + codepush);
            spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.text(target.text() + " \"" + spush + "\" ");
        target.text(target.text() + " # 0x01-0x4B The next opcode bytes is data to be pushed onto the stack\n");
    }
    //else if(opcode == "01")
    // target.text(target.text() + opcode + "\tPUSHBYTES1\t#0x01-0x4B The next opcode bytes is data to be pushed onto the stack\n");
    //else if(opcode == "4b")
    //  target.text(target.text() + opcode + "\tPUSHBYTES75\t#\n");
    else if (opcode == "4c") {
        var bsize = 0;
        var sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize = parseInt(sizepush, 16);
        target.text(target.text() + opcode + "\tPUSHDATA1\t #"+bsize+" bytes: ");
        //var spush = ""; // no need for string, large bytes are usually not string data
        for (i = 0; i < bsize; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.text(target.text() + codepush);
            //spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.text(target.text() + "# " + bsize + " bytes pushed onto the stack\n");
    }
    else if (opcode == "4d") {
        var bsize = 0;
        var sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize = parseInt(sizepush, 16);
        sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize += 256*parseInt(sizepush, 16);
        target.text(target.text() + opcode + "\tPUSHDATA2\t #"+bsize+" bytes: ");
        //var spush = ""; // no need for string, large bytes are usually not string data
        for (i = 0; i < bsize; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.text(target.text() + codepush);
            //spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.text(target.text() + "# " + bsize + " bytes pushed onto the stack\n");
        //target.text(target.text() + opcode + "\tPUSHDATA2\t#The next two bytes contain the number of bytes to be pushed onto the stack\n");
    }
    else if (opcode == "4e") {
        var bsize = 0;
        var sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize = parseInt(sizepush, 16);
        sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize += 256*parseInt(sizepush, 16);
        sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize += 256*256*parseInt(sizepush, 16);
        sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize += 256*256*256*parseInt(sizepush, 16);
        target.text(target.text() + opcode + "\tPUSHDATA4\t #"+bsize+" bytes: ");
        //var spush = ""; // no need for string, large bytes are usually not string data
        for (i = 0; i < bsize; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.text(target.text() + codepush);
            //spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.text(target.text() + "# " + bsize + " bytes pushed onto the stack\n");
        //target.text(target.text() + opcode + "\tPUSHDATA4\t#The next four bytes contain the number of bytes to be pushed onto the stack.\n");
    }
    else if (opcode == "4f")
        target.text(target.text() + opcode + "\tPUSHM1\t#The number -1 is pushed onto the stack.\n");
    else if (opcode == "51")
        target.text(target.text() + opcode + "\tPUSH1\t# The number 1 is pushed onto the stack.\n");
    else if (opcode == "52")
        target.text(target.text() + opcode + "\tPUSH2\t# The number 2 is pushed onto the stack.\n");
    else if (opcode == "53")
        target.text(target.text() + opcode + "\tPUSH3\t# The number 3 is pushed onto the stack.\n");
    else if (opcode == "54")
        target.text(target.text() + opcode + "\tPUSH4\t# The number 4 is pushed onto the stack.\n");
    else if (opcode == "55")
        target.text(target.text() + opcode + "\tPUSH5\t# The number 5 is pushed onto the stack.\n");
    else if (opcode == "56")
        target.text(target.text() + opcode + "\tPUSH6\t# The number 6 is pushed onto the stack.\n");
    else if (opcode == "57")
        target.text(target.text() + opcode + "\tPUSH7\t# The number 7 is pushed onto the stack.\n");
    else if (opcode == "58")
        target.text(target.text() + opcode + "\tPUSH8\t# The number 8 is pushed onto the stack.\n");
    else if (opcode == "59")
        target.text(target.text() + opcode + "\tPUSH9\t# The number 9 is pushed onto the stack.\n");
    else if (opcode == "5a")
        target.text(target.text() + opcode + "\tPUSH10\t# The number 10 is pushed onto the stack.\n");
    else if (opcode == "5b")
        target.text(target.text() + opcode + "\tPUSH11\t# The number 11 is pushed onto the stack.\n");
    else if (opcode == "5c")
        target.text(target.text() + opcode + "\tPUSH12\t# The number 12 is pushed onto the stack.\n");
    else if (opcode == "5d")
        target.text(target.text() + opcode + "\tPUSH13\t# The number 13 is pushed onto the stack.\n");
    else if (opcode == "5e")
        target.text(target.text() + opcode + "\tPUSH14\t# The number 14 is pushed onto the stack.\n");
    else if (opcode == "5f")
        target.text(target.text() + opcode + "\tPUSH15\t# The number 15 is pushed onto the stack.\n");
    else if (opcode == "60")
        target.text(target.text() + opcode + "\tPUSH16\t# The number 16 is pushed onto the stack.\n");
    else if (opcode == "61")
        target.text(target.text() + opcode + "\tNOP\t# Does nothing.\n");
    else if (opcode == "62") {
        target.text(target.text() + opcode + "\tJMP\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        target.text(target.text() + nparfunc + "\n");
    }
    else if (opcode == "63") {
        target.text(target.text() + opcode + "\tJMPIF\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        target.text(target.text() + nparfunc + "\n");
    }
    else if (opcode == "64") {
        target.text(target.text() + opcode + "\tJMPIFNOT\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        target.text(target.text() + nparfunc + "\n");
    }
    else if (opcode == "65")
        target.text(target.text() + opcode + "\tCALL\t# \n");
    else if (opcode == "66")
        target.text(target.text() + opcode + "\tRET\t# \n");
    else if (opcode == "68") {
        target.text(target.text() + opcode + "\tSYSCALL\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        fvalue = parseInt(nparfunc, 16);
        sfunc = "";
        var i = 0;
        for (i = 0; i < fvalue; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            var cvalue = String.fromCharCode(parseInt(codepush, 16));
            sfunc += cvalue;
            //if (sfunc == "Neo.Storage")
            //    $("#cbx_storage")[0].checked = true;
            target.text(target.text() + cvalue);
        }
        target.text(target.text() + "\n");
    }
    else if ((opcode == "67") ||  (opcode == "69")) {  // read 20 bytes in reverse order
        if (opcode == "69")
            target.text(target.text() + opcode + "\tTAILCALL\t#");
        if (opcode == "67")
            target.text(target.text() + opcode + "\tAPPCALL\t#");
        var codecall = "";
        for (i = 0; i < 20; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            codecall = codepush + codecall;
        }
        target.text(target.text() + codecall + "\n");
    }
    else if (opcode == "6a")
        target.text(target.text() + opcode + "\tDUPFROMALTSTACK\t# \n");
    else if (opcode == "6b")
        target.text(target.text() + opcode + "\tTOALTSTACK\t# Puts the input onto the top of the alt stack. Removes it from the main stack.\n");
    else if (opcode == "6c")
        target.text(target.text() + opcode + "\tFROMALTSTACK\t# Puts the input onto the top of the main stack. Removes it from the alt stack.\n");
    else if (opcode == "6d")
        target.text(target.text() + opcode + "\tXDROP\t# \n");
    else if (opcode == "72")
        target.text(target.text() + opcode + "\tXSWAP\t# \n");
    else if (opcode == "73")
        target.text(target.text() + opcode + "\tXTUCK\t# \n");
    else if (opcode == "74")
        target.text(target.text() + opcode + "\tDEPTH\t# Puts the number of stack items onto the stack.\n");
    else if (opcode == "75")
        target.text(target.text() + opcode + "\tDROP\t# Removes the top stack item.\n");
    else if (opcode == "76")
        target.text(target.text() + opcode + "\tDUP\t# Duplicates the top stack item.\n");
    else if (opcode == "77")
        target.text(target.text() + opcode + "\tNIP\t# Removes the second-to-top stack item.\n");
    else if (opcode == "78")
        target.text(target.text() + opcode + "\tOVER\t# Copies the second-to-top stack item to the top.\n");
    else if (opcode == "79")
        target.text(target.text() + opcode + "\tPICK\t# The item n back in the stack is copied to the top.\n");
    else if (opcode == "7a")
        target.text(target.text() + opcode + "\tROLL\t# The item n back in the stack is moved to the top.\n");
    else if (opcode == "7b")
        target.text(target.text() + opcode + "\tROT\t# The top three items on the stack are rotated to the left.\n");
    else if (opcode == "7c")
        target.text(target.text() + opcode + "\tSWAP\t# The top two items on the stack are swapped.\n");
    else if (opcode == "7d")
        target.text(target.text() + opcode + "\tTUCK\t# The item at the top of the stack is copied and inserted before the second-to-top item.\n");
    else if (opcode == "7e")
        target.text(target.text() + opcode + "\tCAT\t# Concatenates two strings.\n");
    else if (opcode == "7f")
        target.text(target.text() + opcode + "\tSUBSTR\t# Returns a section of a string.\n");
    else if (opcode == "80")
        target.text(target.text() + opcode + "\tLEFT\t# Keeps only characters left of the specified point in a string.\n");
    else if (opcode == "81")
        target.text(target.text() + opcode + "\tRIGHT\t# Keeps only characters right of the specified point in a string.\n");
    else if (opcode == "82")
        target.text(target.text() + opcode + "\tSIZE\t# Returns the length of the input string.\n");
    else if (opcode == "83")
        target.text(target.text() + opcode + "\tINVERT\t# Flips all of the bits in the input.\n");
    else if (opcode == "84")
        target.text(target.text() + opcode + "\tAND\t# Boolean and between each bit in the inputs.\n");
    else if (opcode == "85")
        target.text(target.text() + opcode + "\tOR\t# Boolean or between each bit in the inputs.\n");
    else if (opcode == "86")
        target.text(target.text() + opcode + "\tXOR\t# Boolean exclusive or between each bit in the inputs.\n");
    else if (opcode == "87")
        target.text(target.text() + opcode + "\tEQUAL\t# Returns 1 if the inputs are exactly equal, 0 otherwise.\n");
    else if (opcode == "8b")
        target.text(target.text() + opcode + "\tINC\t# 1 is added to the input.\n");
    else if (opcode == "8c")
        target.text(target.text() + opcode + "\tDEC\t# 1 is subtracted from the input.\n");
    else if (opcode == "8d")
        target.text(target.text() + opcode + "\tSIGN\t# \n");
    else if (opcode == "8f")
        target.text(target.text() + opcode + "\tNEGATE\t# The sign of the input is flipped.\n");
    else if (opcode == "90")
        target.text(target.text() + opcode + "\tABS\t# The input is made positive.\n");
    else if (opcode == "91")
        target.text(target.text() + opcode + "\tNOT\t# If the input is 0 or 1, it is flipped. Otherwise the output will be 0.\n");
    else if (opcode == "92")
        target.text(target.text() + opcode + "\tNZ\t# Returns 0 if the input is 0. 1 otherwise.\n");
    else if (opcode == "93")
        target.text(target.text() + opcode + "\tADD\t# a is added to b.\n");
    else if (opcode == "94")
        target.text(target.text() + opcode + "\tSUB\t# b is subtracted from a.\n");
    else if (opcode == "95")
        target.text(target.text() + opcode + "\tMUL\t# a is multiplied by b.\n");
    else if (opcode == "96")
        target.text(target.text() + opcode + "\tDIV\t# a is divided by b.\n");
    else if (opcode == "97")
        target.text(target.text() + opcode + "\tMOD\t# Returns the remainder after dividing a by b.\n");
    else if (opcode == "98")
        target.text(target.text() + opcode + "\tSHL\t# Shifts a left b bits, preserving sign.\n");
    else if (opcode == "99")
        target.text(target.text() + opcode + "\tSHR\t# Shifts a right b bits, preserving sign.\n");
    else if (opcode == "9a")
        target.text(target.text() + opcode + "\tBOOLAND\t# If both a and b are not 0, the output is 1. Otherwise 0.\n");
    else if (opcode == "9b")
        target.text(target.text() + opcode + "\tBOOLOR\t# If a or b is not 0, the output is 1. Otherwise 0.\n");
    else if (opcode == "9c")
        target.text(target.text() + opcode + "\tNUMEQUAL\t# Returns 1 if the numbers are equal, 0 otherwise.\n");
    else if (opcode == "9e")
        target.text(target.text() + opcode + "\tNUMNOTEQUAL\t# Returns 1 if the numbers are not equal, 0 otherwise.\n");
    else if (opcode == "9f")
        target.text(target.text() + opcode + "\tLT\t# Returns 1 if a is less than b, 0 otherwise.\n");
    else if (opcode == "a0")
        target.text(target.text() + opcode + "\tGT\t# Returns 1 if a is greater than b, 0 otherwise.\n");
    else if (opcode == "a1")
        target.text(target.text() + opcode + "\tLTE\t# Returns 1 if a is less than or equal to b, 0 otherwise.\n");
    else if (opcode == "a2")
        target.text(target.text() + opcode + "\tGTE\t# Returns 1 if a is greater than or equal to b, 0 otherwise.\n");
    else if (opcode == "a3")
        target.text(target.text() + opcode + "\tMIN\t# Returns the smaller of a and b.\n");
    else if (opcode == "a3")
        target.text(target.text() + opcode + "\tMIN\t# Returns the smaller of a and b.\n");
    else if (opcode == "a4")
        target.text(target.text() + opcode + "\tMAX\t# Returns the larger of a and b.\n");
    else if (opcode == "a5")
        target.text(target.text() + opcode + "\tWITHIN\t# Returns 1 if x is within the specified range (left-inclusive), 0 otherwise.\n");
    else if (opcode == "a7")
        target.text(target.text() + opcode + "\tSHA1\t# The input is hashed using SHA-1.\n");
    else if (opcode == "a8")
        target.text(target.text() + opcode + "\tSHA256\t# The input is hashed using SHA-256.\n");
    else if (opcode == "a9")
        target.text(target.text() + opcode + "\tHASH160\t# The input is hashed using HASH160.\n");
    else if (opcode == "aa")
        target.text(target.text() + opcode + "\tHASH256\t# The input is hashed using HASH256.\n");
    else if (opcode == "ac")
        target.text(target.text() + opcode + "\tCHECKSIG\t# \n");
    else if (opcode == "ae")
        target.text(target.text() + opcode + "\tCHECKMULTISIG\t# \n");
    else if (opcode == "c0")
        target.text(target.text() + opcode + "\tARRAYSIZE\t# \n");
    else if (opcode == "c1")
        target.text(target.text() + opcode + "\tPACK\t# \n");
    else if (opcode == "c2")
        target.text(target.text() + opcode + "\tUNPACK\t# \n");
    else if (opcode == "c3")
        target.text(target.text() + opcode + "\tPICKITEM\t# \n");
    else if (opcode == "c4")
        target.text(target.text() + opcode + "\tSETITEM\t# \n");
    else if (opcode == "c5")
        target.text(target.text() + opcode + "\tNEWARRAY\t# \n");
    else if (opcode == "c6")
        target.text(target.text() + opcode + "\tNEWSTRUCT\t# \n");
    else if (opcode == "c8")
        target.text(target.text() + opcode + "\tAPPEND\t# \n");
    else if (opcode == "c9")
        target.text(target.text() + opcode + "\tREVERSE\t# \n");
    else if (opcode == "ca")
        target.text(target.text() + opcode + "\tREMOVE\t# \n");
    else if (opcode == "f0")
        target.text(target.text() + opcode + "\tTHROW\t# \n");
    else if (opcode == "f1")
        target.text(target.text() + opcode + "\tTHROWIFNOT\t# \n");
    else {
        target.text(target.text() + opcode + "\t???\t# \n");
    }
    return hexavm;
}

function printOpcode(hexavm, target) {
    if (hexavm.length == 0)
        return; // string is empty
    if (hexavm.length % 2 == 1)
        return; // must be even pairs
    var code = "" + hexavm[0] + hexavm[1];
    hexavm = hexavm.substr(2, hexavm.length);
    //console.log("code ("+code+")");
    hexavm = parseOpcode(code, hexavm, target);
    printOpcode(hexavm, target);
}