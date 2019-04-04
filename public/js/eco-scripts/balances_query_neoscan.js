// ==================================================
// ======== QUERY BALANCES FROM NEOSCAN =============
// ==================================================

// ==================================================
function callClaimableFromNeoScan(adddressToGet, boxToFill = "") {
    url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_claimable/" + adddressToGet;
    $.getJSON(url_toFill, function(resultClaimable) {
        //console.log("resultClaimable is:");
        //console.log(resultClaimable);
        var amountClaimable = 0;
        if (resultClaimable.unclaimed)
            amountClaimable = resultClaimable.unclaimed;

        if (resultClaimable.address && amountClaimable > 0) {
            var resultQueryAddress = resultClaimable.address;
            idToAutomaticClaim = searchAddrIndexFromBase58(resultQueryAddress);
            //console.log("Current gas inside claimable query is " + $("#walletGas" + idToAutomaticClaim).val() );
            var currentGasAmmount = Number($("#walletGas" + idToAutomaticClaim)[0].innerHTML);
            if (currentGasAmmount == map[resultQueryAddress])
                automaticClaim(amountClaimable, idToAutomaticClaim);
            map[resultClaimable.address] = currentGasAmmount;
        }
        fillSpanTextOrInputBox(boxToFill, amountClaimable);
        return amountClaimable;
    });
}
// ==================================================

// ==================================================
function callUnclaimedFromNeoScan(adddressToGet, boxToFill = "", indexKA) {
    url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_unclaimed/" + adddressToGet;
    $.getJSON(url_toFill, function(result) {
        var amountUnclaimable = 0;
        if (result.unclaimed)
            amountUnclaimable = result.unclaimed;

        var selfTransferID = "selfTransfer("+indexKA+")";
        fillSpanTextOrInputBox(boxToFill, '<a onclick=' + selfTransferID + '><i class="fas fa-sm fa-arrow-left"> ' + amountUnclaimable + '</i></a> ');

        return amountUnclaimable;
    });
}
// ==================================================


// ==================================================
//DEPRECATED
function getAllNeoOrGasFromNeoScan(adddressToGet, assetToGet, boxToFill = "", automaticTransfer = false, to = "") {
    var url_toFill = BASE_PATH_NEOSCAN + "/api/main_net/v1/get_balance/" + adddressToGet;
    //console.log("url_toFill: " + url_toFill);
    $.getJSON(url_toFill, function(result) {
        if (boxToFill != "")
            $(boxToFill).val(0);

        if (result.balance) {
            for (i = 0; i < result.balance.length; ++i) {
                if (result.balance[i].asset == assetToGet) {
                    //console.log(assetToGet + " balance is:" + result.balance[i].amount);
                    if (boxToFill != "")
                        $(boxToFill).val(result.balance[i].amount);
                    if (automaticTransfer) {
                        if (to === "")
                            to = adddressToGet;

                        var idToTransfer = searchAddrIndexFromBase58(adddressToGet);
                        //console.log("idToTransfer:" + idToTransfer);
                        if (idToTransfer != -1 && result.balance[i].amount != 0) {
                            if (ECO_WALLET[idToTransfer].account.isMultiSig) {
                                //Multi-sig address
                                neoToSend = 0;
                                gasToSend = 0;
                                if (assetToGet == "NEO")
                                    neoToSend = result.balance[i].amount;
                                else
                                    gasToSend = result.balance[i].amount;
                                createTxFromMSAccount(idToTransfer, to, neoToSend, gasToSend, getCurrentNetworkNickname());
                            } else {
                                createTxFromAccount(idToTransfer, to, result.balance[i].amount, 0, BASE_PATH_CLI, getCurrentNetworkNickname());
                            }
                        }


                    }
                }
            }
        }


    });
}
// ==================================================

// ==================================================
// ======== QUERY BALANCES FROM NEOSCAN =============
// ==================================================
