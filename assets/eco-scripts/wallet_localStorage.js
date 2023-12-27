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

async function getExtraWalletAccountFromLocalStorage() {
    var serializedAccountKeys = getLocalStorage("mySafeEncryptedExtraAccounts");

    if (serializedAccountKeys) {
        var serializedAccountKeysJson = JSON.parse(serializedAccountKeys);
        var myRecreatedExtraAccounts = [];

        // Direct add or try to decrypt 
        await Promise.all(serializedAccountKeysJson.map(async (accountData) => {
            var storedKey = accountData.key;
            var label = accountData.label;
            var print = accountData.print;
            var myRestoredAccount = new Neon.wallet.Account(storedKey);
            try {
                if (!Neon.wallet.isAddress(storedKey) && !Neon.wallet.isPublicKey(storedKey))
                    await myRestoredAccount.decrypt(MASTER_KEY_WALLET);

                myRecreatedExtraAccounts.push({
                    account: myRestoredAccount,
                    label: label,
                    print: print
                });
            } catch (err) {
                console.error(err);
                myRecreatedExtraAccounts = [];
                //$("#btnWalletSaveID")[0].disabled = true;
                $("#btnAddNewAccount")[0].disabled = true;
                $("#btnLoadSavedAccount")[0].disabled = false;
                MASTER_KEY_WALLET = "";
                var footerMsg = "You can not save anything meanwhile. Try to clean or redefine password";
                swal2Simple("Decryption error", "Error when decrypting extra accounts! TryAgain with new password.", 10000, "error", false, footerMsg);
            }
        }));

        //console.log(myRecreatedExtraAccounts)
        if (myRecreatedExtraAccounts.length != 0) {
            //$("#btnWalletSaveID")[0].disabled = false;
            $("#btnAddNewAccount")[0].disabled = false;
            $("#btnLoadSavedAccount")[0].disabled = true;
        }

        return myRecreatedExtraAccounts;
    }
    return [];
}

function restoreWalletExtraAccountsLocalStorage() {
    // Serialized Storage
    var serializedKeys = getLocalStorage("mySafeEncryptedExtraAccounts");
    if (serializedKeys) {
        //Since there are keys, clean button will be enabled
        $("#btnWalletCleanID")[0].disabled = false;

        var serializedKeysJson = JSON.parse(serializedKeys);
        var nAccounts = serializedKeysJson.length;
        var nEncryptedAccounts = getNumberOfSafeEncryptedAccountsFromVector(serializedKeysJson);
        //console.log("You have " + nAccounts + " account and " + nEncryptedAccounts + " encrypted accounts to be decrypted.");

        if (MASTER_KEY_WALLET == "") {
            setMasterKey(() => {
                updateExtraAndEcoWallet();
            }, "Restoring: " + nAccounts + " accounts (" + nEncryptedAccounts + " encrypted)", true);
        } else {
            console.error("restoreWalletExtraAccountsLocalStorage error. Trying to restore with a key already set. Not expected.")
            //updateExtraAndEcoWallet();
        }
    }
}

async function updateExtraAndEcoWallet() {
    var tempWallet = await getExtraWalletAccountFromLocalStorage();
    if (tempWallet.length > 0) {
        ECO_EXTRA_ACCOUNTS = tempWallet;
        ECO_WALLET = DEFAULT_WALLET.concat(ECO_EXTRA_ACCOUNTS);
        drawPopulateAllWalletAccountsInfo();
    }
}

function getNumberOfSafeEncryptedAccountsFromVector(mySafeExtraAccountsWallet) {
    var nEncryptedAccounts = 0;
    if (mySafeExtraAccountsWallet.length > 0)
        for (ea = 0; ea < mySafeExtraAccountsWallet.length; ++ea)
            if (!Neon.wallet.isAddress(mySafeExtraAccountsWallet[ea].key))
                nEncryptedAccounts++;

    return nEncryptedAccounts;
}

/*
function btnWalletSave() {
    if (MASTER_KEY_WALLET == "") {
        setMasterKey(() => {
            extraWalletSave();
        }, "You need to set your password.");
    } else {
        extraWalletSave();
    }
}*/

function extraWalletSave() {
    if (ECO_EXTRA_ACCOUNTS.length > 0) {
        if (MASTER_KEY_WALLET == "") {
            swal2Simple("MASTER KEY NOT FOUND", "A password is required for saving your accounts", 5500, "error");
            return false;
        }

        // Since something is saved Clean will be enabled
        $("#btnWalletCleanID")[0].disabled = false;

        var SAFE_ACCOUNTS = [];
        for (ea = 0; ea < ECO_EXTRA_ACCOUNTS.length; ++ea) {
            if (ECO_EXTRA_ACCOUNTS[ea].account._privateKey != undefined) {
                ECO_EXTRA_ACCOUNTS[ea].account.encrypt(MASTER_KEY_WALLET).then(encryptedAccount => {
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
    } else {
        localStorage.removeItem("mySafeEncryptedExtraAccounts");
        $("#btnWalletCleanID")[0].disabled = true;
    }
}

function btnWalletClean() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-success"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "You will delete all your extra accounts?",
        text: "Be carefull. Your local storage for wallet will be empty.",
        showCancelButton: true,
        icon: "question",
        confirmButtonText: "Yes, delete it!",
        color: "#00AF92",
        background: "#263A40",
    }).then((result) => {
        if (result.isConfirmed) {
            ECO_WALLET = DEFAULT_WALLET;
            ECO_EXTRA_ACCOUNTS = [];
            localStorage.removeItem("mySafeEncryptedExtraAccounts");
            drawPopulateAllWalletAccountsInfo();

            $("#btnAddNewAccount")[0].disabled = false;
            $("#btnLoadSavedAccount")[0].disabled = true;

            swal2Simple("Deleted!", "All saved addresses were delete", 0, "success");
        } else {
            swal2Simple("Safe!", "Your local storage for accounts is preserved", 0, "success");
        }
    });

    // This filter also worked
    //ECO_WALLET = ECO_WALLET.filter( ( el ) => !ECO_EXTRA_ACCOUNTS.includes( el ) );
}


// teste
// 05afacd091c544f8ff9cec33353effde2b26a7153a074afd2b09958021ebdba9