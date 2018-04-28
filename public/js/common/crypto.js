
function getScriptHashFromAVM(avm)
{
    var bitshash160 = sjcl.hash.ripemd160.hash(sjcl.hash.sha256.hash(sjcl.codec.hex.toBits(avm)));
    var chash = revertHexString(sjcl.codec.hex.fromBits(bitshash160));
    return chash;
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