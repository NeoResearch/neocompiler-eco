
// Neon AVM Post-Optimization (minimization of opcodes in Neo AVM)
// NeoResearch team
// Copyleft 2018 - MIT License

// Notice: this project is experimental is probably quite inefficient, it must
// be considered as an inspiration for future developers to follow this path of
// reducing avm size by removing useless opcodes.

// Project will start with a simple algorithm for removing NOP opcodes.

// class NeonOpcode stores single opcode with parameters (in hex)
function NeonOpcode(hexcode, opname, comment="", args="")
{
   this.hexcode = hexcode;
   this.opname = opname;
   this.comment = comment;
   this.args = args;
   this.size = 1+(args.length/2);
};

class NeonOpt
{
   static parseOpcode(opcode, hexavm, oplist=[])
   {
       var pvalue = parseInt(opcode, 16);

       if (opcode == "00")
           oplist.push(new NeonOpcode(opcode, "PUSH0", "#An empty array of bytes is pushed onto the stack"));
       else if ((pvalue >= 1) && (pvalue <= 75)) {
           var strcomment = "# ";
           var i = 0;
           var cpush = "";
           for (i = 0; i < pvalue; i++) {
               cpush += "" + hexavm[0] + hexavm[1];
               hexavm = hexavm.substr(2, hexavm.length);
           }
           //strcomment = " \"" + spush + "\" ";
           strcomment += "# 0x01-0x4B The next opcode bytes is data to be pushed onto the stack";
           oplist.push(new NeonOpcode(opcode, "PUSHBYTES" + pvalue, strcomment, cpush));
       }
       //else if(opcode == "01")
       // target.val(target.val() + opcode + "\tPUSHBYTES1\t#0x01-0x4B The next opcode bytes is data to be pushed onto the stack\n");
       //else if(opcode == "4b")
       //  target.val(target.val() + opcode + "\tPUSHBYTES75\t#\n");
       else if (opcode == "4c") { // PUSHDATA1
           var bsize = 0;
           var sizepush = "" + hexavm[0] + hexavm[1];
           hexavm = hexavm.substr(2, hexavm.length);
           bsize = parseInt(sizepush, 16);
           strcomment = "#"+bsize+" bytes: ";
           var cpush = "";
           for (i = 0; i < bsize; i++) {
               cpush += "" + hexavm[0] + hexavm[1];
               hexavm = hexavm.substr(2, hexavm.length);
           }
           strcomment += "# " + bsize + " bytes pushed onto the stack";
           oplist.push(new NeonOpcode(opcode, "PUSHDATA1", strcomment, cpush));
       }
       else if (opcode == "4d") { // PUSHDATA2
           var bsize = 0;
           var sizepush = "" + hexavm[0] + hexavm[1];
           hexavm = hexavm.substr(2, hexavm.length);
           bsize = parseInt(sizepush, 16);
           sizepush = "" + hexavm[0] + hexavm[1];
           hexavm = hexavm.substr(2, hexavm.length);
           bsize += 256*parseInt(sizepush, 16);
           strcomment = "#"+bsize+" bytes: ";
           var cpush = "";
           for (i = 0; i < bsize; i++) {
               cpush += "" + hexavm[0] + hexavm[1];
               hexavm = hexavm.substr(2, hexavm.length);
           }
           strcomment += "# " + bsize + " bytes pushed onto the stack";
           oplist.push(new NeonOpcode(opcode, "PUSHDATA2", strcomment, cpush));
       }
       else if (opcode == "4e") { // PUSHDATA4
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
           strcomment = "#"+bsize+" bytes: ";
           var cpush = "";
           for (i = 0; i < bsize; i++) {
               cpush += "" + hexavm[0] + hexavm[1];
               hexavm = hexavm.substr(2, hexavm.length);
           }
           strcomment += "# " + bsize + " bytes pushed onto the stack";
           oplist.push(new NeonOpcode(opcode, "PUSHDATA4", strcomment, cpush));
       }
       else if (opcode == "4f")
           oplist.push(new NeonOpcode(opcode, "PUSHM1","#The number -1 is pushed onto the stack."));
       else if (opcode == "51")
           oplist.push(new NeonOpcode(opcode, "PUSH1", "# The number 1 is pushed onto the stack."));
       else if (opcode == "52")
           oplist.push(new NeonOpcode(opcode, "PUSH2", "# The number 2 is pushed onto the stack."));
       else if (opcode == "53")
           oplist.push(new NeonOpcode(opcode, "PUSH3", "# The number 3 is pushed onto the stack."));
       else if (opcode == "54")
           oplist.push(new NeonOpcode(opcode, "PUSH4", "# The number 4 is pushed onto the stack."));
       else if (opcode == "55")
           oplist.push(new NeonOpcode(opcode, "PUSH5", "# The number 5 is pushed onto the stack."));
       else if (opcode == "56")
           oplist.push(new NeonOpcode(opcode, "PUSH6", "# The number 6 is pushed onto the stack."));
       else if (opcode == "57")
           oplist.push(new NeonOpcode(opcode, "PUSH7", "# The number 7 is pushed onto the stack."));
       else if (opcode == "58")
           oplist.push(new NeonOpcode(opcode, "PUSH8", "# The number 8 is pushed onto the stack."));
       else if (opcode == "59")
           oplist.push(new NeonOpcode(opcode, "PUSH9", "# The number 9 is pushed onto the stack."));
       else if (opcode == "5a")
           oplist.push(new NeonOpcode(opcode, "PUSH10", "# The number 10 is pushed onto the stack."));
       else if (opcode == "5b")
           oplist.push(new NeonOpcode(opcode, "PUSH11", "# The number 11 is pushed onto the stack."));
       else if (opcode == "5c")
           oplist.push(new NeonOpcode(opcode, "PUSH12", "# The number 12 is pushed onto the stack."));
       else if (opcode == "5d")
           oplist.push(new NeonOpcode(opcode, "PUSH13", "# The number 13 is pushed onto the stack."));
       else if (opcode == "5e")
           oplist.push(new NeonOpcode(opcode, "PUSH14", "# The number 14 is pushed onto the stack."));
       else if (opcode == "5f")
           oplist.push(new NeonOpcode(opcode, "PUSH15", "# The number 15 is pushed onto the stack."));
       else if (opcode == "60")
           oplist.push(new NeonOpcode(opcode, "PUSH16", "# The number 16 is pushed onto the stack."));
       else if (opcode == "61")
           oplist.push(new NeonOpcode(opcode, "NOP", "# Does nothing."));
       else if (opcode == "62") {
           strcomment = "# ";
           var nparfunc = "" + hexavm[0] + hexavm[1] + hexavm[2] + hexavm[3];
           hexavm = hexavm.substr(4, hexavm.length);
           strcomment += ""+NeonOpt.byteArray2ToInt16(NeonOpt.littleHexStringToBigByteArray(nparfunc));
           oplist.push(new NeonOpcode(opcode, "JMP", strcomment, nparfunc));
       }
       else if (opcode == "63") {
           strcomment = "# ";
           var nparfunc = "" + hexavm[0] + hexavm[1] + hexavm[2] + hexavm[3];
           hexavm = hexavm.substr(4, hexavm.length);
           strcomment += ""+NeonOpt.byteArray2ToInt16(NeonOpt.littleHexStringToBigByteArray(nparfunc));
           oplist.push(new NeonOpcode(opcode, "JMPIF", strcomment, nparfunc));
       }
       else if (opcode == "64") {
           strcomment = "# ";
           var nparfunc = "" + hexavm[0] + hexavm[1] + hexavm[2] + hexavm[3];
           hexavm = hexavm.substr(4, hexavm.length);
           strcomment += ""+NeonOpt.byteArray2ToInt16(NeonOpt.littleHexStringToBigByteArray(nparfunc));
           oplist.push(new NeonOpcode(opcode, "JMPIFNOT", strcomment, nparfunc));
       }
       else if (opcode == "65")
           oplist.push(new NeonOpcode(opcode, "CALL", "#"));
       else if (opcode == "66")
           oplist.push(new NeonOpcode(opcode, "RET", "#"));
       else if (opcode == "68") {
           strcomment = "# ";
           var nparfunc = "" + hexavm[0] + hexavm[1];
           cpush = nparfunc;
           hexavm = hexavm.substr(2, hexavm.length);
           var fvalue = parseInt(nparfunc, 16);
           //sfunc = "";
           var i = 0;
           for (i = 0; i < fvalue; i++) {
               cpush += "" + hexavm[0] + hexavm[1];
               hexavm = hexavm.substr(2, hexavm.length);
               //var cvalue = String.fromCharCode(parseInt(codepush, 16));
               //sfunc += cvalue;
               //if (sfunc == "Neo.Storage")
               //    $("#cbx_storage")[0].checked = true;
               //target.val(target.val() + cvalue);
           }
           //target.val(target.val() + "\n");
           oplist.push(new NeonOpcode(opcode, "SYSCALL", strcomment, cpush));
       }
       else if ((opcode == "67") ||  (opcode == "69")) {  // read 20 bytes in reverse order
           var opname = "";
           if (opcode == "69")
               opname = "TAILCALL";
           if (opcode == "67")
               opname = "APPCALL";
           var codecall = "";
           for (i = 0; i < 20; i++) {
               var codepush = "" + hexavm[0] + hexavm[1];
               hexavm = hexavm.substr(2, hexavm.length);
               //codecall = codepush + codecall;
               codecall += codepush;
           }
           //target.val(target.val() + codecall + "\n");
           oplist.push(new NeonOpcode(opcode, opname, strcomment, codecall));
       }
       else if (opcode == "6a")
           oplist.push(new NeonOpcode(opcode, "DUPFROMALTSTACK", "#"));
       else if (opcode == "6b")
           oplist.push(new NeonOpcode(opcode, "TOALTSTACK", "# Puts the input onto the top of the alt stack. Removes it from the main stack."));
       else if (opcode == "6c")
           oplist.push(new NeonOpcode(opcode, "FROMALTSTACK", "# Puts the input onto the top of the main stack. Removes it from the alt stack."));
       else if (opcode == "6d")
           oplist.push(new NeonOpcode(opcode, "XDROP", "#"));
       else if (opcode == "72")
           oplist.push(new NeonOpcode(opcode, "XSWAP", "#"));
       else if (opcode == "73")
           oplist.push(new NeonOpcode(opcode, "XTUCK", "#"));
       else if (opcode == "74")
           oplist.push(new NeonOpcode(opcode, "DEPTH", "# Puts the number of stack items onto the stack."));
       else if (opcode == "75")
           oplist.push(new NeonOpcode(opcode, "DROP", "# Removes the top stack item."));
       else if (opcode == "76")
           oplist.push(new NeonOpcode(opcode, "DUP", "# Duplicates the top stack item."));
       else if (opcode == "77")
           oplist.push(new NeonOpcode(opcode, "NIP", "# Removes the second-to-top stack item."));
       else if (opcode == "78")
           oplist.push(new NeonOpcode(opcode, "OVER", "# Copies the second-to-top stack item to the top."));
       else if (opcode == "79")
           oplist.push(new NeonOpcode(opcode, "PICK", "# The item n back in the stack is copied to the top."));
       else if (opcode == "7a")
           oplist.push(new NeonOpcode(opcode, "ROLL", "# The item n back in the stack is moved to the top."));
       else if (opcode == "7b")
           oplist.push(new NeonOpcode(opcode, "ROT", "# The top three items on the stack are rotated to the left."));
       else if (opcode == "7c")
           oplist.push(new NeonOpcode(opcode, "SWAP", "# The top two items on the stack are swapped."));
       else if (opcode == "7d")
           oplist.push(new NeonOpcode(opcode, "TUCK", "# The item at the top of the stack is copied and inserted before the second-to-top item."));
       else if (opcode == "7e")
           oplist.push(new NeonOpcode(opcode, "CAT", "# Concatenates two strings."));
       else if (opcode == "7f")
           oplist.push(new NeonOpcode(opcode, "SUBSTR", "# Returns a section of a string."));
       else if (opcode == "80")
           oplist.push(new NeonOpcode(opcode, "LEFT", "# Keeps only characters left of the specified point in a string."));
       else if (opcode == "81")
           oplist.push(new NeonOpcode(opcode, "RIGHT", "# Keeps only characters right of the specified point in a string."));
       else if (opcode == "82")
           oplist.push(new NeonOpcode(opcode, "SIZE", "# Returns the length of the input string."));
       else if (opcode == "83")
           oplist.push(new NeonOpcode(opcode, "INVERT", "# Flips all of the bits in the input."));
       else if (opcode == "84")
           oplist.push(new NeonOpcode(opcode, "AND", "# Boolean and between each bit in the inputs."));
       else if (opcode == "85")
           oplist.push(new NeonOpcode(opcode, "OR", "# Boolean or between each bit in the inputs."));
       else if (opcode == "86")
           oplist.push(new NeonOpcode(opcode, "XOR", "# Boolean exclusive or between each bit in the inputs."));
       else if (opcode == "87")
           oplist.push(new NeonOpcode(opcode, "EQUAL", "# Returns 1 if the inputs are exactly equal, 0 otherwise."));
       else if (opcode == "8b")
           oplist.push(new NeonOpcode(opcode, "INC", "# 1 is added to the input."));
       else if (opcode == "8c")
           oplist.push(new NeonOpcode(opcode, "DEC", "# 1 is subtracted from the input."));
       else if (opcode == "8d")
           oplist.push(new NeonOpcode(opcode, "SIGN", "#"));
       else if (opcode == "8f")
           oplist.push(new NeonOpcode(opcode, "NEGATE", "# The sign of the input is flipped."));
       else if (opcode == "90")
           oplist.push(new NeonOpcode(opcode, "ABS", "# The input is made positive."));
       else if (opcode == "91")
           oplist.push(new NeonOpcode(opcode, "NOT", "# If the input is 0 or 1, it is flipped. Otherwise the output will be 0."));
       else if (opcode == "92")
           oplist.push(new NeonOpcode(opcode, "NZ", "# Returns 0 if the input is 0. 1 otherwise."));
       else if (opcode == "93")
           oplist.push(new NeonOpcode(opcode, "ADD", "# a is added to b."));
       else if (opcode == "94")
           oplist.push(new NeonOpcode(opcode, "SUB", "# b is subtracted from a."));
       else if (opcode == "95")
           oplist.push(new NeonOpcode(opcode, "MUL", "# a is multiplied by b."));
       else if (opcode == "96")
           oplist.push(new NeonOpcode(opcode, "DIV", "# a is divided by b."));
       else if (opcode == "97")
           oplist.push(new NeonOpcode(opcode, "MOD", "# Returns the remainder after dividing a by b."));
       else if (opcode == "98")
           oplist.push(new NeonOpcode(opcode, "SHL", "# Shifts a left b bits, preserving sign."));
       else if (opcode == "99")
           oplist.push(new NeonOpcode(opcode, "SHR", "# Shifts a right b bits, preserving sign."));
       else if (opcode == "9a")
           oplist.push(new NeonOpcode(opcode, "BOOLAND", "# If both a and b are not 0, the output is 1. Otherwise 0."));
       else if (opcode == "9b")
           oplist.push(new NeonOpcode(opcode, "BOOLOR", "# If a or b is not 0, the output is 1. Otherwise 0."));
       else if (opcode == "9c")
           oplist.push(new NeonOpcode(opcode, "NUMEQUAL", "# Returns 1 if the numbers are equal, 0 otherwise."));
       else if (opcode == "9e")
           oplist.push(new NeonOpcode(opcode, "NUMNOTEQUAL", "# Returns 1 if the numbers are not equal, 0 otherwise."));
       else if (opcode == "9f")
           oplist.push(new NeonOpcode(opcode, "LT", "# Returns 1 if a is less than b, 0 otherwise."));
       else if (opcode == "a0")
           oplist.push(new NeonOpcode(opcode, "GT", "# Returns 1 if a is greater than b, 0 otherwise."));
       else if (opcode == "a1")
           oplist.push(new NeonOpcode(opcode, "LTE", "# Returns 1 if a is less than or equal to b, 0 otherwise."));
       else if (opcode == "a2")
           oplist.push(new NeonOpcode(opcode, "GTE", "# Returns 1 if a is greater than or equal to b, 0 otherwise."));
       else if (opcode == "a3")
           oplist.push(new NeonOpcode(opcode, "MIN", "# Returns the smaller of a and b."));
       else if (opcode == "a4")
           oplist.push(new NeonOpcode(opcode, "MAX", "# Returns the larger of a and b."));
       else if (opcode == "a5")
           oplist.push(new NeonOpcode(opcode, "WITHIN", "# Returns 1 if x is within the specified range (left-inclusive), 0 otherwise."));
       else if (opcode == "a7")
           oplist.push(new NeonOpcode(opcode, "SHA1", "# The input is hashed using SHA-1."));
       else if (opcode == "a8")
           oplist.push(new NeonOpcode(opcode, "SHA256", "# The input is hashed using SHA-256."));
       else if (opcode == "a9")
           oplist.push(new NeonOpcode(opcode, "HASH160", "# The input is hashed using HASH160."));
       else if (opcode == "aa")
           oplist.push(new NeonOpcode(opcode, "HASH256", "# The input is hashed using HASH256."));
       else if (opcode == "ac")
           oplist.push(new NeonOpcode(opcode, "CHECKSIG", "#"));
       else if (opcode == "ae")
           oplist.push(new NeonOpcode(opcode, "CHECKMULTISIG", "#"));
       else if (opcode == "c0")
           oplist.push(new NeonOpcode(opcode, "ARRAYSIZE", "#"));
       else if (opcode == "c1")
           oplist.push(new NeonOpcode(opcode, "PACK", "#"));
       else if (opcode == "c2")
           oplist.push(new NeonOpcode(opcode, "UNPACK", "#"));
       else if (opcode == "c3")
           oplist.push(new NeonOpcode(opcode, "PICKITEM", "#"));
       else if (opcode == "c4")
           oplist.push(new NeonOpcode(opcode, "SETITEM", "#"));
       else if (opcode == "c5")
           oplist.push(new NeonOpcode(opcode, "NEWARRAY", "#"));
       else if (opcode == "c6")
           oplist.push(new NeonOpcode(opcode, "NEWSTRUCT", "#"));
       else if (opcode == "c8")
           oplist.push(new NeonOpcode(opcode, "APPEND", "#"));
       else if (opcode == "c9")
           oplist.push(new NeonOpcode(opcode, "REVERSE", "#"));
       else if (opcode == "ca")
           oplist.push(new NeonOpcode(opcode, "REMOVE", "#"));
       else if (opcode == "f0")
           oplist.push(new NeonOpcode(opcode, "THROW", "#"));
       else if (opcode == "f1")
           oplist.push(new NeonOpcode(opcode, "THROWIFNOT", "#"));
       else {
           oplist.push(new NeonOpcode(opcode, "???", "#"));
       }
       return hexavm;
   }

   // expects big endian byte array and converts to signed int16
   static byteArray2ToInt16(v)
   {
      if(v.length != 2)
         return 0;
      return  (((v[0] << 8) | v[1]) << 16) >> 16;
   }

   // expects signed int16 -> returns byte array with length 2
   static int16ToByteArray2(i16)
   {
      var vhex = (i16 >>> 0).toString(16);
      while(vhex.length < 4)
         vhex = '0'+vhex;
      while(vhex.length > 4)
         vhex = vhex.substr(1, vhex.length);
      var v = [];
      while(v.length < 2)
      {
         v.push(Number('0x'+vhex[0]+vhex[1]));
         vhex = vhex.substr(2, vhex.length);
      }
      return v;

      /*
      var bin = Number(i16).toString(2);
      while(bin.length < 16)
         bin = '0'+bin;
      var v = [];
      v.push(Number('0x'+)) // ...........
      if(v.length != 2)
         return 0;
      return  (((v[0] << 8) | v[1]) << 16) >> 16;
      */
   }

   // convert little endian hexstring (4 chars) to big endian bytearray (2 bytes)
   static littleHexStringToBigByteArray(lhs4)
   {
      if(lhs4.length != 4)
         return [];

      var bba = [];
      while(lhs4.length > 0)
      {
         bba.push(Number('0x'+lhs4[0]+lhs4[1]));
         lhs4 = lhs4.substr(2, lhs4.length);
      }
      bba.reverse(); // little endian to big endian // TODO: Why not needed?
      return bba;
   }

   static bigByteArray2TolittleHexString(bba2)
   {
      if(bba2.length != 2)
         return "";

      var lhs4 = "";
      var i = 0;
      for(i=0; i<bba2.length; i++)
      {
         var sbyte = bba2[i].toString(16);
         if(sbyte.length == 1)
            sbyte = '0'+sbyte; // ensure 2 char byte
         lhs4 = sbyte + lhs4; // back to little endian
      }
      return lhs4;
   }


   static removeNOP(oplist)
   {
      //console.log("Removing NOP from oplist(size="+oplist.length+")");
      var countnop = 0;
      var count_jmp_fwd_adjust = 0; // forward jumps
      var count_jmp_bwd_adjust = 0; // backward jumps
      var i = 0;
      while(i < oplist.length)
      {
         //console.log("scanning "+oplist[i].hexcode+" i="+i+"/"+oplist.length);
         //console.log("checking opcode at i="+i+" opcode="+oplist[i].hexcode);
         if(oplist[i].hexcode == "61")
         {
            console.log("found NOP at i="+i+" oplist="+oplist.length+"\n");
            countnop++;
            // found NOP!
            // Step 0: remove NOP
            console.log("removing: "+JSON.stringify(oplist[i]));
            oplist.splice(i, 1);
            console.log("next i: "+JSON.stringify(oplist[i]));

            // Step 1: remove forward jumps
            var j = i - 1;
            var count_dist = 1; // 1 byte
            while(j > 0) {
               if(oplist[j].opname[0] == 'J') { // JUMP
                  var jmp = NeonOpt.byteArray2ToInt16(NeonOpt.littleHexStringToBigByteArray(oplist[j].args));
                  if(count_dist <= jmp) // jump (-3 bytes) after or equals to NOP position
                  {
                     console.log("Jumping "+jmp+"positions forward at j="+j+ " (nop at i="+i+")");
                     console.log("count_dist "+count_dist+"<= jmp="+jmp);
                     count_jmp_fwd_adjust++;
                     jmp -= 1;
                     var ba_jmp = NeonOpt.bigByteArray2TolittleHexString(NeonOpt.int16ToByteArray2(jmp));
                     //console.log("next jump value="+jmp+" ba="+ba_jmp);
                     oplist[j].args = ba_jmp;
                     oplist[j].comment = "# "+jmp;
                  }
               }
               count_dist += oplist[j].size; // add size of current opcode
               j--;
            } // end while step 1

            // Step 2: remove backward jumps
            var j = i;
            var count_dist = 1; // 1 byte
            while(j < oplist.length) {
               // if jump! check if nop removal the jump (must add 1).
               if(oplist[j].opname[0] == 'J') { // JUMP
                  //console.log("FOUND JUMP AT j="+j+" count_dist="+count_dist);
                  var jmp = NeonOpt.byteArray2ToInt16(NeonOpt.littleHexStringToBigByteArray(oplist[j].args));
                  //console.log("initial jump value="+jmp+" ba="+oplist[j].args);
                  if(jmp <= -count_dist) // jump (-3 bytes) before or equals to NOP position
                  {
                     // adjust jump value (+1)
                     count_jmp_bwd_adjust++;
                     jmp += 1;
                     var ba_jmp = NeonOpt.bigByteArray2TolittleHexString(NeonOpt.int16ToByteArray2(jmp));
                     //console.log("next jump value="+jmp+" ba="+ba_jmp);
                     oplist[j].args = ba_jmp;
                     oplist[j].comment = "# "+jmp;
                  }
               }
               count_dist += oplist[j].size; // add size of current opcode
               j++;
            } // finish step 2 jump search

            // no more optimizations for NOP
         }
         else // if NOP not found
            i++;
      }

      console.log("removed NOPs: "+countnop+" Adjusted "+count_jmp_fwd_adjust+" fwd jumps and "+count_jmp_bwd_adjust+" bwd jumps.");
      return countnop;
   } // removeNOP

   static getAVMFromList(oplist) {
      var avm = "";
      var i = 0;
      for(i = 0; i<oplist.length; i++)
         avm += oplist[i].hexcode + oplist[i].args;
      return avm;
   }

}
