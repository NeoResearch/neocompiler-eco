
function getScriptHashFromAVM(avm)
{
    var hash = Neon.u.reverseHex(Neon.u.hash160(avm));
    return hash;
}


function toBase58(data)
{
    var hexdata = "17" + Neon.u.reverseHex(data);
    var bitchecksum = Neon.u.sha256(Neon.u.sha256(hexdata));
    var buffer = hexdata + bitchecksum.slice(0,8); //get 4 bytes
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
    for (var i = 0; i < input.length - 1; i += 2)
    {
        if (input.substr(i, 2) == "00")
            sb = ""+Alphabet.charAt(0)+sb;
        else
            break;
    }
    return sb;
}
