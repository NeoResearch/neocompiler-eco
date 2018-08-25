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

function elipsisMiddle(str) {
  if (str.length > 8) {
    return str.substr(0, 4) + '...' + str.substr(str.length-4, str.length);
  }
  return str;
}

// javascript big integer to big-endian byte array (C# representation)
function bigint2bebytearray(bigint) {
   if(bigint >= 0){
      bihex = bigint.toString(16);
      if(bihex.length % 2 == 1)
         bihex = "0"+bihex;
      return revertHexString("00"+bihex); // '00' only really necessary in a few cases... TODO: improve that
   }
   else
      return negbigint2behex(bigint);
}


// integer to string hex array with default padding = 2 (10 => 'a' => '0a')
function int2hex(intvalue, padding = 2) {
  if(intvalue < 0)
     intvalue = 0;
  hval = intvalue.toString(16);
  while(hval.length < padding)
     hval = "0"+hval;
  return hval;
}
// behex2bigint($('#convert_bytearray')[0].value)
// big endian hex string converted to javascript big integer
function behex2bigint(behex) {
  x = behex;
  // if needs padding
  if(x.length % 2 == 1)
    x = '0'+x;
  // check negative bit
  y = x.slice(x.length-2,x.length+2);
  //console.log("base="+y);
  // detect negative values
  bitnum = parseInt(y, 16).toString(2);
  //console.log("bitnum="+bitnum);
  // -1389293829382
  if((bitnum.length == 8) && (bitnum[0]=="1")) {
    // negative number
      //console.log("negative!");
      //console.log(behex);
      rbitnum = parseInt(revertHexString(behex),16).toString(2);
      // negate bits
      y2 = "";
      for(i = 0; i<rbitnum.length; i++)
         y2 += rbitnum[i]=='0'?'1':'0';
      finalnum = -1*(parseInt(y2, 2) + 1);
      return finalnum;
  }
  else {
    // positive number: positive is easy, just revert and convert to int (TODO: beware javascript natural precision loss)
    return parseInt(revertHexString(behex), 16);
  }
}

// negative big integers returned as (big-endian) hex
// TODO: use it to create javascript class csBigInteger (C# Big Integer)
function negbigint2behex(intvalue) {
   if(intvalue >= 0) // ONLY NEGATIVE!
      return null;
   x = intvalue;
   /*
   // https://msdn.microsoft.com/en-us/library/system.numerics.biginteger(v=vs.110).aspx
   The BigInteger structure assumes that negative values are stored by using two's complement representation. Because the BigInteger structure represents a numeric value with no fixed length, the BigInteger(Byte[]) constructor always interprets the most significant bit of the last byte in the array as a sign bit. To prevent the BigInteger(Byte[]) constructor from confusing the two's complement representation of a negative value with the sign and magnitude representation of a positive value, positive values in which the most significant bit of the last byte in the byte array would ordinarily be set should include an additional byte whose value is 0. For example, 0xC0 0xBD 0xF0 0xFF is the little-endian hexadecimal representation of either -1,000,000 or 4,293,967,296. Because the most significant bit of the last byte in this array is on, the value of the byte array would be interpreted by the BigInteger(Byte[]) constructor as -1,000,000. To instantiate a BigInteger whose value is positive, a byte array whose elements are 0xC0 0xBD 0xF0 0xFF 0x00 must be passed to the constructor.
   */
   //x=-1000000; // must become (big endian) "f0bdc0" => little endian C0 BD F0  (careful with positive 4,293,967,296 that may become negative, need to be C0 BD F0 FF 00)
   // ASSERT (x < 0) !!! x==0 is problematic! equals to 256...
   //x=-1; // ff
   //x=-2; // fe
   //x=-127; // 81
   //x=-255; // "ff01" => 01 ff
   //x=-256; // "ff00" => 00 ff
   //x=-257; // "feff" => ff fe
   //x=-128; // "ff80" => 80 ff
   // only for negative integers
   x *= -1; // turn into positive
   // ========================
   // perform two's complement
   // ========================
   // convert to binary
   y = x.toString(2);
   //console.log("FIRST BINARY: "+y);
   // extra padding for limit cases (avoid overflow)
   y = "0"+y;
   //guarantee length must be at least 8, or add padding!
   while((y.length<8) || (y.length % 8 != 0)) {
      //console.log("ADDING PADDING 1!");
      y = "0"+y;
   }
   // invert bits
   y2 = "";
   for(i = 0; i<y.length; i++)
      y2 += y[i]=='0'?'1':'0';
   //console.log("SECOND BINARY: "+y2);
   // go back to int
   y3 = parseInt(y2, 2);
   //console.log("INT is "+y3);
   // sum 1
   y3 += 1;
   //console.log("INT is after sum "+y3);
   // convert to binary again
   y4 = y3.toString(2);
   //guarantee length must be at least 8, or add padding!
   while(y4.length < 8) {
      //console.log("ADDING PADDING!");
      y4 = "0"+y4;
   }
   ///// verify if most important bit in LAST byte would is already set... (NO NEED.. ONLY FOR POSITIVE INTEGERS)
   //index = y4.length-8;
   //if(y4[index]=='0') {
       //console.log("CREATING EXTRA BYTE! BUT HOW?");
       // must create an extra byte just to inform sign...
       //y4="10000000"+y4; // could be 1xxxxxxx I guess, but everyone is just using f0 (which is 11110000)...
   //}

   //console.log("final binary:"+y4);

   // convert to hex
   y5 = parseInt(y4,2).toString(16);
   // adjust padding

   return revertHexString(y5); // big endian
}

function uint2bytes(intvalue) {
  if(intvalue < 0)
     intvalue = 0;

  if(intvalue <= 252)
  {
	  hval = intvalue.toString(16);
	  while(hval.length < 2)
	     hval = "0"+hval;

	  return hval;
  }

  if(intvalue > 252)
  {
	  hval = intvalue.toString(16);
	  while(hval.length < 4)
	     hval = "0"+hval;
          hval=revertHexString(hval);

	  return "fd" + hval;
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

function hex2int(hex) {
    var bigint = BigInteger(0);
    bigint = bigint.add(parseInt(hex.substr(i, 2), 16));
    for (var i = 2; i < hex.length - 1; i += 2)
        bigint = bigint.multiply(256).add(parseInt(hex.substr(i, 2), 16));
    return bigint;
}

function revertHexString(hex) {
    return Neon.u.reverseHex(hex);
}


/*
function revertHexString(hex) {
    var reverthex = "";
    for (var i = 0; i < hex.length - 1; i += 2)
        reverthex = "" + hex.substr(i, 2) + reverthex;
    return reverthex;
}
*/
