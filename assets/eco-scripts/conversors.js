/* String <-> Hex */
function str2hex() {
    var i = 0;
    $("#strhex_hex").val(Neon.u.str2hexstring($("#strhex_str").val()));
    $("#hex_length").val(($("#strhex_hex").val().length / 2).toString());
};

function hex2str() {
    $("#strhex_str").val(Neon.u.hexstring2str($("#strhex_hex").val()));
    $("#hex_length").val(($("#strhex_hex").val().length / 2).toString());
};

/* Hex  <-> xeH */
function hex2xeh() {
    $("#hexxeh_xeh").val(revertHexString($("#hexxeh_hex").val()));
    $("#hex_length").val($("#strhex_hex").val().length.toString());
};

function xeh2hex() {
    $("#hexxeh_hex").val(revertHexString($("#hexxeh_xeh").val()));
};

// base64 <-> hex

function b64hx() {
    $("#b64hx_hex_base64").val(
        base64ToHex($("#b64hx_base64_hex").val())
    );
};

function hxb64() {
    $("#b64hx_base64_hex").val(
        hexToBase64($("#b64hx_hex_base64").val())
    );
};


/* Number <-> Fixed8 Hex */
function num2fixed8() {
    const a = new Neon.u.Fixed8(parseInt($("#fx8_number").val()));
    $("#fx8_hex").val(a.toHex());
};

function fixed82num() {
    const a = new Neon.u.Fixed8.fromHex($("#fx8_hex").val());
    $("#fx8_number").val(a);
};

/* Address <-> ScriptHash (big endian) */
function address2scripthash() {
    if ($("#address_conversor").val() == "") return;
    $("#scripthash_conversor").val(fromBase58($("#address_conversor").val()));
}

function scripthash2address() {
    if ($("#scripthash_conversor").val() == "") return;
    var b58 = toBase58($("#scripthash_conversor").val());
    if (b58 == "")
        b58 = "BAD FORMAT! Expects 20 bytes!";
    $("#address_conversor").val(b58);
    //CreateRawTx();
}

/* BigInteger <-> Little-Endian ByteArray */
function conv_bigint2lebytearray() {
    valbigint = $('#convert_bigint')[0].value;
    //console.log("converting int:"+valbigint);
    $('#convert_bytearray')[0].value = bigint2lebytearray(valbigint);
}

function conv_lebytearray2bigint() {
    vbytearray = $('#convert_bytearray')[0].value;
    //console.log("converting int:"+valbigint);
    $('#convert_bigint')[0].value = "" + lehex2bigint(vbytearray);
}

function conv_string_hash() {
    $("#convert_string_hash256")[0].value = Neon.u.hash256($("#convert_string_hash")[0].value);
    $("#convert_string_hash160")[0].value = Neon.u.hash160($("#convert_string_hash")[0].value);
    $("#convert_string_sha256")[0].value = Neon.u.sha256($("#convert_string_hash")[0].value);
}