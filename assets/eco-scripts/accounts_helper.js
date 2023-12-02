// searchAddrIndexFromAddressPrivateKeyWifiLabelEncrypted
function searchWalletID(BASE_ARRAY_SEARCH, baseValue) {
    for (iToFind = 0; iToFind < BASE_ARRAY_SEARCH.length; ++iToFind) {
        if (BASE_ARRAY_SEARCH[iToFind].account._encrypted != null)
            if (BASE_ARRAY_SEARCH[iToFind].account.encrypted == baseValue)
                return iToFind;

        if (BASE_ARRAY_SEARCH[iToFind].account.address == baseValue)
            return iToFind;

        if (BASE_ARRAY_SEARCH[iToFind].label == baseValue)
            return iToFind;

        if (BASE_ARRAY_SEARCH[iToFind].account._privateKey != null)
            if (BASE_ARRAY_SEARCH[iToFind].account.privateKey == baseValue)
                return iToFind;

        if (BASE_ARRAY_SEARCH[iToFind].account._WIF != null)
            if (BASE_ARRAY_SEARCH[iToFind].account.WIF == baseValue)
                return iToFind;
    }

    return -1;
}


function searchAddrIndexFromLabel(addressLabelToTryToGet) {
    for (iToFind = 0; iToFind < ECO_WALLET.length; ++iToFind)
        if (ECO_WALLET[iToFind].account._encrypted == null)
            if (ECO_WALLET[iToFind].label == addressLabelToTryToGet)
                return iToFind;
    return -1;
}

function getWifIfKnownAddress(addressToTryToGet) {
    var index = searchAddrIndexFromBase58(addressToTryToGet);
    if (index != -1)
        return ECO_WALLET[index].account.WIF;
    else
        return -1;
}

function isEncryptedOnly(idToCheck) {
    if (ECO_WALLET[idToCheck].account._encrypted != null)
        if (ECO_WALLET[idToCheck].account._address == null)
            return true;

    return false;
}

function isMultiSig(idToCheck) {
    if (ECO_WALLET[idToCheck].account.contract.parameters.length > 1)
        return true;
    return false;
}

function isWatchOnlyAndNotDapi(idToCheck) {
    var isWatchOnly = false;
    if (ECO_WALLET[idToCheck].account._privateKey === undefined && !isMultiSig(idToCheck) && !(getDapiConnectedWallet() == idToCheck))
        isWatchOnly = true;

    return isWatchOnly;
}

//Just add if we have privateKey or WIF
function getMultiSigSignersID(publicKeys, threshold) {
    var signingAccountsIDs = [];
    if (publicKeys.length >= threshold) {
        for (pk = 0; pk < publicKeys.length; pk++) {
            currentPK = publicKeys[pk];
            for (ka = 0; ka < ECO_WALLET.length; ka++) {
                if (typeof (ECO_WALLET[ka].account._privateKey) != "undefined")
                    if (typeof (ECO_WALLET[ka].account._publicKey) != "undefined")
                        if (ECO_WALLET[ka].account.publicKey == currentPK) {
                            signingAccountsIDs.push(ka);
                            continue;
                        }
            }
        }
        return signingAccountsIDs;
    } else {
        console.error("Error trying to getMultiSigSignersID with threshold greater than pKeys!!")
        return [];
    }
}