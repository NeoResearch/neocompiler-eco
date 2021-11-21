function searchAddrIndexFromBase58(addressBase58ToTryToGet) {
    for (iToFind = 0; iToFind < ECO_WALLET.length; ++iToFind)
        if (ECO_WALLET[iToFind].account._encrypted == null)
            if (ECO_WALLET[iToFind].account.address == addressBase58ToTryToGet)
                return iToFind;
    return -1;
}

function searchAddrIndexFromLabel(addressLabelToTryToGet) {
    for (iToFind = 0; iToFind < ECO_WALLET.length; ++iToFind)
        if (ECO_WALLET[iToFind].account._encrypted == null)
            if (ECO_WALLET[iToFind].label == addressLabelToTryToGet)
                return iToFind;
    return -1;
}

function searchAddrIndexFromWif(wifToTryToGet) {
    for (iToFind = 0; iToFind < ECO_WALLET.length; ++iToFind)
        if (ECO_WALLET[iToFind].account._encrypted == null)
            if (ECO_WALLET[iToFind].account._WIF != null)
                if (ECO_WALLET[iToFind].account.WIF == wifToTryToGet)
                    return iToFind;
    return -1;
}

function searchAddrIndexFromEncrypted(encryptedToTryToGet) {
    for (iToFind = 0; iToFind < ECO_WALLET.length; ++iToFind)
        if (ECO_WALLET[iToFind].account._encrypted != null)
            if (ECO_WALLET[iToFind].account.encrypted == encryptedToTryToGet)
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

//Just add if we have privateKey or WIF
function getMultiSigSignersID(publicKeys, threshold) {
    var signingAccountsIDs = [];
    if (publicKeys.length >= threshold) {
        for (pk = 0; pk < publicKeys.length; pk++) {
            currentPK = publicKeys[pk];
            for (ka = 0; ka < ECO_WALLET.length; ka++) {
                if (typeof(ECO_WALLET[ka].account._privateKey) != "undefined")
                    if (typeof(ECO_WALLET[ka].account._publicKey) != "undefined")
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