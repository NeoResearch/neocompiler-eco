function searchAddrIndexFromBase58(addressBase58ToTryToGet) {
    for (iToFind = 0; iToFind < ECO_WALLET.length; ++iToFind)
        if (ECO_WALLET[iToFind].account._encrypted == null)
            if (ECO_WALLET[iToFind].account.address == addressBase58ToTryToGet)
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
