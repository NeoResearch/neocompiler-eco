function getIDFromExtraAccount(addressToSearch) {
    for (ea = 0; ea < ECO_EXTRA_ACCOUNTS.length; ++ea)
        if (ECO_EXTRA_ACCOUNTS[ea].account.address == addressToSearch)
            return ea;

    console.error("ERROR WHILE SEARCHING FOR ADDRESS");
    swal2Simple("Search error", "ERROR WHILE SEARCHING FOR ADDRESS", 5500, "error");
    return -1;
}
function getIDFromExtraAccountStillEncrypted(baseEncrypted, encryptedToSearch) {
    for (ea = 0; ea < baseEncrypted.length; ++ea)
        if (baseEncrypted[ea].encrypted != undefined)
            if (baseEncrypted[ea].encrypted == encryptedToSearch)
                return ea;

    console.error("ERROR WHILE SEARCHING FOR ADDRESS");
    swal2Simple("Search error", "ERROR WHILE SEARCHING FOR ADDRESS", 5500, "error");
    return -1;
}


function getExtraWalletAccountFromLocalStorage() {
    var mySafeExtraAccountsWallet = getLocalStorage("mySafeEncryptedExtraAccounts");
    if (mySafeExtraAccountsWallet) {
        mySafeExtraAccountsWallet = JSON.parse(mySafeExtraAccountsWallet);
        var myRecreatedExtraAccounts = [];
        for (ea = 0; ea < mySafeExtraAccountsWallet.length; ++ea) {
            var storedKey = mySafeExtraAccountsWallet[ea].key;
            var myRestoredAccount = new Neon.wallet.Account(storedKey);
            myRecreatedExtraAccounts.push({
                account: myRestoredAccount,
                label: mySafeExtraAccountsWallet[ea].label,
                print: mySafeExtraAccountsWallet[ea].print
            });

            if (!Neon.wallet.isAddress(storedKey)) {
                myRestoredAccount.decrypt("teste").then(decryptedAccount => {
                    drawPopulateAllWalletAccountsInfo();
                }).catch(err => {
                    console.error(err);
                    swal2Simple("Decryption error", "Error when decrypting extra accounts!", 5500, "error");
                });
            }

        }
        return myRecreatedExtraAccounts;
    }

    return [];
}


function restoreWalletExtraAccountsLocalStorage() {
    var tempWallet = getExtraWalletAccountFromLocalStorage();
    if (tempWallet != [] && tempWallet.length > 0) {
        ECO_EXTRA_ACCOUNTS = tempWallet;
        ECO_WALLET = DEFAULT_WALLET;
        ECO_WALLET = ECO_WALLET.concat(ECO_EXTRA_ACCOUNTS);
    }
}

function btnWalletSave() {
    var SAFE_ACCOUNTS = [];
    for (ea = 0; ea < ECO_EXTRA_ACCOUNTS.length; ++ea) {
        if (ECO_EXTRA_ACCOUNTS[ea].account._privateKey != undefined) {
            ECO_EXTRA_ACCOUNTS[ea].account.encrypt("teste").then(encryptedAccount => {
                var restoredID = getIDFromExtraAccount(encryptedAccount.address);
                SAFE_ACCOUNTS.push({
                    key: encryptedAccount.encrypted,
                    label: ECO_EXTRA_ACCOUNTS[restoredID].label,
                    print: ECO_EXTRA_ACCOUNTS[restoredID].print
                });
                setLocalStorage("mySafeEncryptedExtraAccounts", JSON.stringify(SAFE_ACCOUNTS));
            }).catch(err => {
                console.error(err);
                swal2Simple("Encryption error", "Error when encripting extra accounts!", 5500, "error");
            });
        } else {
            SAFE_ACCOUNTS.push({
                key: ECO_EXTRA_ACCOUNTS[ea].account.address,
                label: ECO_EXTRA_ACCOUNTS[ea].label,
                print: ECO_EXTRA_ACCOUNTS[ea].print
            });
            setLocalStorage("mySafeEncryptedExtraAccounts", JSON.stringify(SAFE_ACCOUNTS));
        }
    }
}

function btnWalletClean() {
    // This filter also worked
    //ECO_WALLET = ECO_WALLET.filter( ( el ) => !ECO_EXTRA_ACCOUNTS.includes( el ) );
    ECO_WALLET = DEFAULT_WALLET;
    ECO_EXTRA_ACCOUNTS = [];
    setLocalStorage("mySafeEncryptedExtraAccounts", JSON.stringify(ECO_EXTRA_ACCOUNTS));
    drawPopulateAllWalletAccountsInfo();
}


// teste
// 05afacd091c544f8ff9cec33353effde2b26a7153a074afd2b09958021ebdba9