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

function int2hex(intvalue, mindigits = 2) {
  if(intvalue < 0)
     intvalue = 0;
  hval = intvalue.toString(16);
  while(hval.length < mindigits)
     hval = "0"+hval;
  return hval;
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
