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


// Calculate gas cost
//https://github.com/neo-project/docs/blob/master/en-us/sc/systemfees.md
// https://github.com/neo-project/neo-vm/blob/master/src/neo-vm/OpCode.cs
function parseOpcode(opcode, hexavm, target) {
    var pvalue = parseInt(opcode, 16);
    if (opcode == "00")
        target.val(target.val() + opcode + "\tPUSH0\t#An empty array of bytes is pushed onto the stack\n");
    else if ((pvalue >= 1) && (pvalue <= 75)) {
        target.val(target.val() + opcode + "\tPUSHBYTES" + pvalue + "\t # ");
        var i = 0;
        var spush = "";
        for (i = 0; i < pvalue; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.val(target.val() + codepush);
            spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.val(target.val() + " \"" + spush + "\" ");
        target.val(target.val() + " # 0x01-0x4B The next opcode bytes is data to be pushed onto the stack\n");
    }
    //else if(opcode == "01")
    // target.val(target.val() + opcode + "\tPUSHBYTES1\t#0x01-0x4B The next opcode bytes is data to be pushed onto the stack\n");
    //else if(opcode == "4b")
    //  target.val(target.val() + opcode + "\tPUSHBYTES75\t#\n");
    else if (opcode == "4c") {
        var bsize = 0;
        var sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize = parseInt(sizepush, 16);
        target.val(target.val() + opcode + "\tPUSHDATA1\t #"+bsize+" bytes: ");
        //var spush = ""; // no need for string, large bytes are usually not string data
        for (i = 0; i < bsize; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.val(target.val() + codepush);
            //spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.val(target.val() + "# " + bsize + " bytes pushed onto the stack\n");
    }
    else if (opcode == "4d") {
        var bsize = 0;
        var sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize = parseInt(sizepush, 16);
        sizepush = "" + hexavm[0] + hexavm[1];
        hexavm = hexavm.substr(2, hexavm.length);
        bsize += 256*parseInt(sizepush, 16);
        target.val(target.val() + opcode + "\tPUSHDATA2\t #"+bsize+" bytes: ");
        //var spush = ""; // no need for string, large bytes are usually not string data
        for (i = 0; i < bsize; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.val(target.val() + codepush);
            //spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.val(target.val() + "# " + bsize + " bytes pushed onto the stack\n");
        //target.val(target.val() + opcode + "\tPUSHDATA2\t#The next two bytes contain the number of bytes to be pushed onto the stack\n");
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
        target.val(target.val() + opcode + "\tPUSHDATA4\t #"+bsize+" bytes: ");
        //var spush = ""; // no need for string, large bytes are usually not string data
        for (i = 0; i < bsize; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            target.val(target.val() + codepush);
            //spush += String.fromCharCode(parseInt(codepush, 16));
        }
        target.val(target.val() + "# " + bsize + " bytes pushed onto the stack\n");
        //target.val(target.val() + opcode + "\tPUSHDATA4\t#The next four bytes contain the number of bytes to be pushed onto the stack.\n");
    }
    else if (opcode == "4f")
        target.val(target.val() + opcode + "\tPUSHM1\t#The number -1 is pushed onto the stack.\n");
    else if (opcode == "51")
        target.val(target.val() + opcode + "\tPUSH1\t# The number 1 is pushed onto the stack.\n");
    else if (opcode == "52")
        target.val(target.val() + opcode + "\tPUSH2\t# The number 2 is pushed onto the stack.\n");
    else if (opcode == "53")
        target.val(target.val() + opcode + "\tPUSH3\t# The number 3 is pushed onto the stack.\n");
    else if (opcode == "54")
        target.val(target.val() + opcode + "\tPUSH4\t# The number 4 is pushed onto the stack.\n");
    else if (opcode == "55")
        target.val(target.val() + opcode + "\tPUSH5\t# The number 5 is pushed onto the stack.\n");
    else if (opcode == "56")
        target.val(target.val() + opcode + "\tPUSH6\t# The number 6 is pushed onto the stack.\n");
    else if (opcode == "57")
        target.val(target.val() + opcode + "\tPUSH7\t# The number 7 is pushed onto the stack.\n");
    else if (opcode == "58")
        target.val(target.val() + opcode + "\tPUSH8\t# The number 8 is pushed onto the stack.\n");
    else if (opcode == "59")
        target.val(target.val() + opcode + "\tPUSH9\t# The number 9 is pushed onto the stack.\n");
    else if (opcode == "5a")
        target.val(target.val() + opcode + "\tPUSH10\t# The number 10 is pushed onto the stack.\n");
    else if (opcode == "5b")
        target.val(target.val() + opcode + "\tPUSH11\t# The number 11 is pushed onto the stack.\n");
    else if (opcode == "5c")
        target.val(target.val() + opcode + "\tPUSH12\t# The number 12 is pushed onto the stack.\n");
    else if (opcode == "5d")
        target.val(target.val() + opcode + "\tPUSH13\t# The number 13 is pushed onto the stack.\n");
    else if (opcode == "5e")
        target.val(target.val() + opcode + "\tPUSH14\t# The number 14 is pushed onto the stack.\n");
    else if (opcode == "5f")
        target.val(target.val() + opcode + "\tPUSH15\t# The number 15 is pushed onto the stack.\n");
    else if (opcode == "60")
        target.val(target.val() + opcode + "\tPUSH16\t# The number 16 is pushed onto the stack.\n");
    else if (opcode == "61")
        target.val(target.val() + opcode + "\tNOP\t# Does nothing.\n");
    else if (opcode == "62") {
        target.val(target.val() + opcode + "\tJMP\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1] + hexavm[2] + hexavm[3];
        hexavm = hexavm.substr(4, hexavm.length);
        target.val(target.val() + nparfunc + "\n");
    }
    else if (opcode == "63") {
        target.val(target.val() + opcode + "\tJMPIF\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1] + hexavm[2] + hexavm[3];
        hexavm = hexavm.substr(4, hexavm.length);
        target.val(target.val() + nparfunc + "\n");
    }
    else if (opcode == "64") {
        target.val(target.val() + opcode + "\tJMPIFNOT\t# ");
        var nparfunc = "" + hexavm[0] + hexavm[1] + hexavm[2] + hexavm[3];
        hexavm = hexavm.substr(4, hexavm.length);
        target.val(target.val() + nparfunc + "\n");
    }
    else if (opcode == "65")
        target.val(target.val() + opcode + "\tCALL\t# \n");
    else if (opcode == "66")
        target.val(target.val() + opcode + "\tRET\t# \n");
    else if (opcode == "68") {
        target.val(target.val() + opcode + "\tSYSCALL\t# ");
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
            target.val(target.val() + cvalue);
        }
        target.val(target.val() + "\n");
    }
    else if ((opcode == "67") ||  (opcode == "69")) {  // read 20 bytes in reverse order
        if (opcode == "69")
            target.val(target.val() + opcode + "\tTAILCALL\t#");
        if (opcode == "67")
            target.val(target.val() + opcode + "\tAPPCALL\t#");
        var codecall = "";
        for (i = 0; i < 20; i++) {
            var codepush = "" + hexavm[0] + hexavm[1];
            hexavm = hexavm.substr(2, hexavm.length);
            codecall = codepush + codecall;
        }
        target.val(target.val() + codecall + "\n");
    }
    else if (opcode == "6a")
        target.val(target.val() + opcode + "\tDUPFROMALTSTACK\t# \n");
    else if (opcode == "6b")
        target.val(target.val() + opcode + "\tTOALTSTACK\t# Puts the input onto the top of the alt stack. Removes it from the main stack.\n");
    else if (opcode == "6c")
        target.val(target.val() + opcode + "\tFROMALTSTACK\t# Puts the input onto the top of the main stack. Removes it from the alt stack.\n");
    else if (opcode == "6d")
        target.val(target.val() + opcode + "\tXDROP\t# \n");
    else if (opcode == "72")
        target.val(target.val() + opcode + "\tXSWAP\t# \n");
    else if (opcode == "73")
        target.val(target.val() + opcode + "\tXTUCK\t# \n");
    else if (opcode == "74")
        target.val(target.val() + opcode + "\tDEPTH\t# Puts the number of stack items onto the stack.\n");
    else if (opcode == "75")
        target.val(target.val() + opcode + "\tDROP\t# Removes the top stack item.\n");
    else if (opcode == "76")
        target.val(target.val() + opcode + "\tDUP\t# Duplicates the top stack item.\n");
    else if (opcode == "77")
        target.val(target.val() + opcode + "\tNIP\t# Removes the second-to-top stack item.\n");
    else if (opcode == "78")
        target.val(target.val() + opcode + "\tOVER\t# Copies the second-to-top stack item to the top.\n");
    else if (opcode == "79")
        target.val(target.val() + opcode + "\tPICK\t# The item n back in the stack is copied to the top.\n");
    else if (opcode == "7a")
        target.val(target.val() + opcode + "\tROLL\t# The item n back in the stack is moved to the top.\n");
    else if (opcode == "7b")
        target.val(target.val() + opcode + "\tROT\t# The top three items on the stack are rotated to the left.\n");
    else if (opcode == "7c")
        target.val(target.val() + opcode + "\tSWAP\t# The top two items on the stack are swapped.\n");
    else if (opcode == "7d")
        target.val(target.val() + opcode + "\tTUCK\t# The item at the top of the stack is copied and inserted before the second-to-top item.\n");
    else if (opcode == "7e")
        target.val(target.val() + opcode + "\tCAT\t# Concatenates two strings.\n");
    else if (opcode == "7f")
        target.val(target.val() + opcode + "\tSUBSTR\t# Returns a section of a string.\n");
    else if (opcode == "80")
        target.val(target.val() + opcode + "\tLEFT\t# Keeps only characters left of the specified point in a string.\n");
    else if (opcode == "81")
        target.val(target.val() + opcode + "\tRIGHT\t# Keeps only characters right of the specified point in a string.\n");
    else if (opcode == "82")
        target.val(target.val() + opcode + "\tSIZE\t# Returns the length of the input string.\n");
    else if (opcode == "83")
        target.val(target.val() + opcode + "\tINVERT\t# Flips all of the bits in the input.\n");
    else if (opcode == "84")
        target.val(target.val() + opcode + "\tAND\t# Boolean and between each bit in the inputs.\n");
    else if (opcode == "85")
        target.val(target.val() + opcode + "\tOR\t# Boolean or between each bit in the inputs.\n");
    else if (opcode == "86")
        target.val(target.val() + opcode + "\tXOR\t# Boolean exclusive or between each bit in the inputs.\n");
    else if (opcode == "87")
        target.val(target.val() + opcode + "\tEQUAL\t# Returns 1 if the inputs are exactly equal, 0 otherwise.\n");
    else if (opcode == "8b")
        target.val(target.val() + opcode + "\tINC\t# 1 is added to the input.\n");
    else if (opcode == "8c")
        target.val(target.val() + opcode + "\tDEC\t# 1 is subtracted from the input.\n");
    else if (opcode == "8d")
        target.val(target.val() + opcode + "\tSIGN\t# \n");
    else if (opcode == "8f")
        target.val(target.val() + opcode + "\tNEGATE\t# The sign of the input is flipped.\n");
    else if (opcode == "90")
        target.val(target.val() + opcode + "\tABS\t# The input is made positive.\n");
    else if (opcode == "91")
        target.val(target.val() + opcode + "\tNOT\t# If the input is 0 or 1, it is flipped. Otherwise the output will be 0.\n");
    else if (opcode == "92")
        target.val(target.val() + opcode + "\tNZ\t# Returns 0 if the input is 0. 1 otherwise.\n");
    else if (opcode == "93")
        target.val(target.val() + opcode + "\tADD\t# a is added to b.\n");
    else if (opcode == "94")
        target.val(target.val() + opcode + "\tSUB\t# b is subtracted from a.\n");
    else if (opcode == "95")
        target.val(target.val() + opcode + "\tMUL\t# a is multiplied by b.\n");
    else if (opcode == "96")
        target.val(target.val() + opcode + "\tDIV\t# a is divided by b.\n");
    else if (opcode == "97")
        target.val(target.val() + opcode + "\tMOD\t# Returns the remainder after dividing a by b.\n");
    else if (opcode == "98")
        target.val(target.val() + opcode + "\tSHL\t# Shifts a left b bits, preserving sign.\n");
    else if (opcode == "99")
        target.val(target.val() + opcode + "\tSHR\t# Shifts a right b bits, preserving sign.\n");
    else if (opcode == "9a")
        target.val(target.val() + opcode + "\tBOOLAND\t# If both a and b are not 0, the output is 1. Otherwise 0.\n");
    else if (opcode == "9b")
        target.val(target.val() + opcode + "\tBOOLOR\t# If a or b is not 0, the output is 1. Otherwise 0.\n");
    else if (opcode == "9c")
        target.val(target.val() + opcode + "\tNUMEQUAL\t# Returns 1 if the numbers are equal, 0 otherwise.\n");
    else if (opcode == "9e")
        target.val(target.val() + opcode + "\tNUMNOTEQUAL\t# Returns 1 if the numbers are not equal, 0 otherwise.\n");
    else if (opcode == "9f")
        target.val(target.val() + opcode + "\tLT\t# Returns 1 if a is less than b, 0 otherwise.\n");
    else if (opcode == "a0")
        target.val(target.val() + opcode + "\tGT\t# Returns 1 if a is greater than b, 0 otherwise.\n");
    else if (opcode == "a1")
        target.val(target.val() + opcode + "\tLTE\t# Returns 1 if a is less than or equal to b, 0 otherwise.\n");
    else if (opcode == "a2")
        target.val(target.val() + opcode + "\tGTE\t# Returns 1 if a is greater than or equal to b, 0 otherwise.\n");
    else if (opcode == "a3")
        target.val(target.val() + opcode + "\tMIN\t# Returns the smaller of a and b.\n");
    else if (opcode == "a3")
        target.val(target.val() + opcode + "\tMIN\t# Returns the smaller of a and b.\n");
    else if (opcode == "a4")
        target.val(target.val() + opcode + "\tMAX\t# Returns the larger of a and b.\n");
    else if (opcode == "a5")
        target.val(target.val() + opcode + "\tWITHIN\t# Returns 1 if x is within the specified range (left-inclusive), 0 otherwise.\n");
    else if (opcode == "a7")
        target.val(target.val() + opcode + "\tSHA1\t# The input is hashed using SHA-1.\n");
    else if (opcode == "a8")
        target.val(target.val() + opcode + "\tSHA256\t# The input is hashed using SHA-256.\n");
    else if (opcode == "a9")
        target.val(target.val() + opcode + "\tHASH160\t# The input is hashed using HASH160.\n");
    else if (opcode == "aa")
        target.val(target.val() + opcode + "\tHASH256\t# The input is hashed using HASH256.\n");
    else if (opcode == "ac")
        target.val(target.val() + opcode + "\tCHECKSIG\t# \n");
    else if (opcode == "ae")
        target.val(target.val() + opcode + "\tCHECKMULTISIG\t# \n");
    else if (opcode == "c0")
        target.val(target.val() + opcode + "\tARRAYSIZE\t# \n");
    else if (opcode == "c1")
        target.val(target.val() + opcode + "\tPACK\t# \n");
    else if (opcode == "c2")
        target.val(target.val() + opcode + "\tUNPACK\t# \n");
    else if (opcode == "c3")
        target.val(target.val() + opcode + "\tPICKITEM\t# \n");
    else if (opcode == "c4")
        target.val(target.val() + opcode + "\tSETITEM\t# \n");
    else if (opcode == "c5")
        target.val(target.val() + opcode + "\tNEWARRAY\t# \n");
    else if (opcode == "c6")
        target.val(target.val() + opcode + "\tNEWSTRUCT\t# \n");
    else if (opcode == "c8")
        target.val(target.val() + opcode + "\tAPPEND\t# \n");
    else if (opcode == "c9")
        target.val(target.val() + opcode + "\tREVERSE\t# \n");
    else if (opcode == "ca")
        target.val(target.val() + opcode + "\tREMOVE\t# \n");
    else if (opcode == "f0")
        target.val(target.val() + opcode + "\tTHROW\t# \n");
    else if (opcode == "f1")
        target.val(target.val() + opcode + "\tTHROWIFNOT\t# \n");
    else {
        target.val(target.val() + opcode + "\t???\t# \n");
    }
    return hexavm;
}

/*
function printOpcode(hexavm, target) {
    if (hexavm.length == 0)
        return; // string is empty
    if (hexavm.length % 2 == 1)
        return; // must be even pairs
    var firstOpcode = "" + hexavm[0] + hexavm[1];
    hexavm = hexavm.substr(2, hexavm.length);
    //console.log("code ("+code+")");
    hexavm = parseOpcode(firstOpcode, hexavm, target);
    printOpcode(hexavm, target);
}
*/

function printOpcode(hexavm, target) {
    var avmsizebytes = hexavm.length/2;
    //console.log("printOpcode (target='"+target+"')");
    if (hexavm.length == 0)
        return; // string is empty
    if (hexavm.length % 2 == 1)
        return; // must be even pairs
    //var firstOpcode = "" + hexavm[0] + hexavm[1];
    //hexavm = hexavm.substr(2, hexavm.length);

    var oplist = [];
    //console.log("code ("+code+")");
    //hexavm = NeonOpt.parseOpcode(firstOpcode, hexavm, oplist);
    NeonOpt.parseOpcodeList(hexavm, oplist);

    target.val("#"+avmsizebytes+" bytes\n");
    var i = 0;
    for(i = 0; i<oplist.length; i++)
      target.val(target.val() + oplist[i].hexcode + " "+ oplist[i].opname + " " +oplist[i].args + " " + oplist[i].comment + "\n");
    var count_ops = oplist.length;

    /*
    console.log("will remove NOPs");
    var nop_rem = NeonOpt.removeNOP(oplist);
    console.log("will detectDUPFROMALTSTACK");
    var op_dup = NeonOpt.detectDUPFROMALTSTACK(oplist);
    console.log("will inline SWAP");
    var op_inlineswap = NeonOpt.inlineSWAP(oplist);
    */
    var rem_ops = NeonOpt.optimizeAVM(oplist);

    var count_ops2 = oplist.length;
    target.val(target.val()+"\n#AFTER OPTIMIZATIONS: ops "+count_ops+"=>"+count_ops2+" op_reduction:"+parseFloat(100.0*(count_ops-count_ops2)/count_ops).toFixed(2)+"%\n");
    for(i = 0; i<oplist.length; i++)
      target.val(target.val() + oplist[i].hexcode + " "+ oplist[i].opname + " " +oplist[i].args + " " + oplist[i].comment + "\n");

    var finalavm = NeonOpt.getAVMFromList(oplist);
    var avmsizefinalbytes = finalavm.length/2;
    target.val(target.val()+"\n#FINAL AVM: "+avmsizefinalbytes+" bytes ("+oplist.length+" ops) byte compression " + parseFloat(100.0*(avmsizebytes-avmsizefinalbytes)/avmsizebytes).toFixed(2)+"%\n"+finalavm+"\n");
    target.val(target.val()+"#OPTIMIZED AVM USING neon-opt: bytes "+parseFloat(100.0*(avmsizebytes-avmsizefinalbytes)/avmsizebytes).toFixed(2)+"% | ops "+parseFloat(100.0*(count_ops-count_ops2)/count_ops).toFixed(2)+"%\n");

    //target.val(oplist);
    //console.log("oplist: "+JSON.stringify(oplist));
}

/*
function parseOpcodeList(hexavm, oplist) {
    if (hexavm.length == 0)
        return; // string is empty
    if (hexavm.length % 2 == 1)
        return; // must be even pairs
    var firstOpcode = "" + hexavm[0] + hexavm[1];
    hexavm = hexavm.substr(2, hexavm.length);
    //console.log("code ("+code+")");
    hexavm = NeonOpt.parseOpcode(firstOpcode, hexavm, oplist);
    parseOpcodeList(hexavm, oplist);
}
*/
