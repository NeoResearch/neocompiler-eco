function togglePasswordSwal() {
    const passwordField = $('#input-newaccount-password-1');
    const passwordFieldType = passwordField.attr('type');
    passwordField.attr('type', passwordFieldType === 'password' ? 'text' : 'password');
}

//First verifications for adding new wallet
function addWalletFromForm() {
    var type = $("#type_to_register")[0].value;
    var keyToAdd = $("#accountToAddInfo")[0].value;
    var labelToAdd = $("#accountLabelToAddInfo")[0].value;

    if (labelToAdd === "")
        labelToAdd = makeid(5) + "_From_" + type;

    if (keyToAdd == "") {
        swal2Simple("Error when adding " + type, "Empty key", 5500, "error");
        return false;
    }

    if (type == 'address' && !Neon.wallet.isAddress(keyToAdd)) {
        swal2Simple("Error when adding " + type, "Not valid", 5500, "error");
        return false;
    }

    if (type == 'scripthash' && !Neon.wallet.isScriptHash(keyToAdd)) {
        swal2Simple("Error when adding " + type, "Not valid", 5500, "error");
        return false;
    }

    if (type == 'publickey' && !Neon.wallet.isPublicKey(keyToAdd)) {
        swal2Simple("Error when adding " + type, "Not valid", 5500, "error");
        return false;
    }

    if (type == 'wif' && !Neon.wallet.isWIF(keyToAdd)) {
        swal2Simple("Error when adding " + type, "Not valid", 5500, "error");
        return false;
    }

    if (type == 'privatekey' && !Neon.wallet.isPrivateKey(keyToAdd)) {
        swal2Simple("Error when adding " + type, "Not valid", 5500, "error");
        return false;
    }

    if (["publickey", "address", "scripthash", "privatekey", "wif"].includes(type)) {
        var accountToAdd = new Neon.wallet.Account(keyToAdd);
        addSafeAccount(accountToAdd, labelToAdd);
    }

    if (type == 'multisig') {
        var accountToAdd = getAccountFromMultiSigVerification(keyToAdd);
        addSafeAccount(accountToAdd, labelToAdd);
    }

    // Even more complex because requires first decrypting
    if (type == 'encryptedkey') {
        tryToDecrypt(keyToAdd, labelToAdd);
    }
}

function addAccountAndDraw(accountToAdd, labelToAdd) {
    if (addToWallet(accountToAdd, labelToAdd))
        drawPopulateAllWalletAccountsInfo();
}

function addSafeAccount(accountToAdd, labelToAdd) {
    //Asks for password if privatekey or wif or encrypted
    if (MASTER_KEY_WALLET != "") {
        swal2Simple("Your master key is already defined", "This account will be linked to your password.\n Remember it!", 5500, "success");
        addAccountAndDraw(accountToAdd, labelToAdd);
    } else {
        setMasterKey(() => {
            addAccountAndDraw(accountToAdd, labelToAdd);
        }, "Importing new account");
    }
}

function setMasterKey(callback, labelToAdd, loading = false) {
    var serializedHTML =
        '<div class="input-group">' +
        '<input id="input-newaccount-password-1" placeholder="password" class="form-control swal-input" type="password">' +
        '<br>' +
        '<input id="input-newaccount-password-2" placeholder="password" class="form-control swal-input" type="password">' +
        '<br>' +
        '<div class="input-group-append">' +
        '<button class="btn btn-outline-secondary" type="button" onclick="togglePasswordSwal()">Show/Hide</button>' +
        '</div>' +
        '</div>';

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Define your Master Key for local storage.\n" + labelToAdd,
        html: serializedHTML,
        color: "#00AF92",
        background: "#263A40",
        confirmButtonText: "Confirm password",
        preConfirm: () => {
            var pass1 = document.getElementById("input-newaccount-password-1").value;
            var pass2 = document.getElementById("input-newaccount-password-2").value;
            if (pass1 !== "" && pass1 == pass2) {
                MASTER_KEY_WALLET = pass1;
                swal2Simple("Your Master Key has been set", "Remember your password", 5500, "success");
                return true;
            }
            else {
                Swal.update({ footer: "Password should be the same." })
                return false;
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            callback();
        } else {
            // if loading user should not be able to save of add until loaded or cleanned
            if (loading) {
                // Disable Save
                // Disable add new accounts
                // Only enable load or clean
                //$("#btnWalletSaveID")[0].disabled = true;
                $("#btnAddNewAccount")[0].disabled = true;
                $("#btnLoadSavedAccount")[0].disabled = false;
            }
            swal2Simple("You are blocked from importing new accounts!", "A MasterKey is needed for continuing.", 0, "error");
            //callback();
        }
    });
}


function tryToDecrypt(keyToAdd, labelToAdd) {
    var serializedHTML =
        '<div class="input-group">' +
        '<input id="input-newaccount-password-1" placeholder="Enter your decription key" class="form-control swal-input" type="password">' +
        '<br>' +
        '<div class="input-group-append">' +
        '<button class="btn btn-outline-secondary" type="button" onclick="togglePasswordSwal()">Show/Hide</button>' +
        '</div>' +
        '</div>';

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-success",
        },
        buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
        title: "Let's try to decrypt your account. Enter your password.",
        footer: "After that the MasterKey will be used to re-encrypt.",
        html: serializedHTML,
        color: "#00AF92",
        background: "#263A40",
        confirmButtonText: "Decrypt",
        preConfirm: async () => {
            return new Promise(async (resolve) => {
                var pass = document.getElementById("input-newaccount-password-1").value;
                var accountToAdd = new Neon.wallet.Account(keyToAdd);
                try {
                    Swal.update({ footer: "Decrypting..." });
                    const decryptedAccount = await accountToAdd.decrypt(pass);
                    addSafeAccount(decryptedAccount, labelToAdd);
                    resolve(true); // Resolve with true if decryption is successful
                } catch (err) {
                    //console.error(err);
                    Swal.update({ footer: "Decryption error. Password should be wrong." });
                    resolve(false); // Resolve with false if decryption fails
                }
            });
        }
    }).then((result) => {
    });
}

function addContractToWallet(scriptHashToAdd) {
    var accountToAdd;
    if (scriptHashToAdd != '') {
        accountToAdd = new Neon.wallet.Account(scriptHashToAdd);
        labelToAdd = scriptHashToAdd.slice(0, 3) + "..." + scriptHashToAdd.slice(-3)
        if (addToWallet(accountToAdd, labelToAdd))
            drawPopulateAllWalletAccountsInfo();

        $('.nav a[href="#nav-wallet"]').tab('show');
    } else
        console.log("Nothing to add. Scripthash looks to be empty!");
}

//TODO Add support for adding multisig and specialSC
function addToWallet(accountToAdd, labelToAdd, verificationScriptToAdd = "") {
    if (!accountToAdd.isMultiSig) {
        if (checkIfAccountAlreadyBelongsToEcoWallet(accountToAdd.address))
            return false;
    } else {
        // Checks for multisig
        var vsToAdd = accountToAdd.contract.script;
        if (vsToAdd == '') {
            alert("Verification script is empty for this multisig!");
            return false;
        }

        if (accountToAdd.address != toBase58(getScriptHashFromAVM(vsToAdd))) {
            alert("Error on converting verification script to base58");
            return false;
        }

        if (checkIfAccountAlreadyBelongsToEcoWallet(addressBase58ToAdd))
            return false;
    }
    // TODO --- CHECK IF IT IS OK WITHOUT OWNERS FOR MULTI SIGNATURES
    addExtraAccountAndUpdateWallet(accountToAdd, labelToAdd, true);
    return true;
}
//===============================================================

function checkIfAccountAlreadyBelongsToEcoWallet(baseValue) {
    var registeredIndex = searchWalletID(ECO_WALLET, baseValue);

    if (registeredIndex != -1) {
        var sTitle = "Public addressBase58 already registered for ECO_WALLET.";
        var sText = "Please, delete index " + registeredIndex + " first.";
        swal2Simple(sTitle, sText, 5500, "error");
        return true;
    }
    return false;
}

function addExtraAccountAndUpdateWallet(accToAdd, labelToAdd, print) {
    var newAcc = {
        account: accToAdd,
        label: labelToAdd,
        print: print
    };
    ECO_EXTRA_ACCOUNTS.push(newAcc);
    ECO_WALLET.push(newAcc);
    extraWalletSave();
}