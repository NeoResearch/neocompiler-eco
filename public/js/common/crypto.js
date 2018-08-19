
// converts avm in hex to script hashe
// example: '21031a6c6fbbdf02ca351745fa86b9ba5a9452d785ac4f7fc2b7548ca2a46c4fcf4aac' => 'e9eed8dc39332032dc22e5d6e86332c50327ba23'
function getScriptHashFromAVM(avm)
{
    var hash = Neon.u.reverseHex(Neon.u.hash160(avm));
    return hash;
}

// converts scripthash in hex to base58 address
// example:  'e9eed8dc39332032dc22e5d6e86332c50327ba23' => 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y'
function toBase58(address)
{
    return Neon.wallet.getAddressFromScriptHash(address);
}

// converts pubKeyToConvert in hex to base58 address
function toBase58FromPublicKey(pubKeyToConvert)
{
    if(!Neon.default.is.publicKey(pubKeyToConvert))
    {
	console.log( pubKeyToConvert + " does not seems to be a valid publicKey.")
	return;
    }
   
    return toBase58(getScriptHashFromAVM("21" + pubKeyToConvert + "ac"));
}

// converts base58 address to scripthash (in hex)
// example: 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y' => 'e9eed8dc39332032dc22e5d6e86332c50327ba23'
function fromBase58(scripthash)
{
    return Neon.wallet.getScriptHashFromAddress(scripthash);
}

// gets WIF in base58 and returns private key in hex
// example: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr' => '1dd37fba80fec4e6a6f13fd708d8dcb3b29def768017052f6c930fa1c5d90bbb'
function WIFtoPrivKey(wif)
{
    return Neon.wallet.getPrivateKeyFromWIF(wif);
}

/*
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
*/
