//===============================================================
function drawWalletsStatus() {
    var table = document.createElement("tbody");
    //table.setAttribute('class', 'table');
    //table.style.width = '20px';

    var headerRow = document.createElement('tr');
    headerRow.className = "headerrd";
    var headersLabel = document.createElement('td');
    var headersNeoBalance = document.createElement('td');
    var headersGasBalance = document.createElement('td');
    var headersUnclaimed = document.createElement('td');
    var headersAddress = document.createElement('td');

    headersLabel.innerHTML = "<b><center><font size='1'>LABEL</font></b>";
    headerRow.insertCell(-1).appendChild(headersLabel);
    headersAddress.innerHTML = "<b><center><font size='1'>ADDRESS</font></b>";
    headerRow.insertCell(-1).appendChild(headersAddress);
    headersNeoBalance.innerHTML = "<b><center><font size='1'>NEO</font></b>";
    headerRow.insertCell(-1).appendChild(headersNeoBalance);
    headersGasBalance.innerHTML = "<b><center><font size='1'>GAS</font></b>";
    headerRow.insertCell(-1).appendChild(headersGasBalance);
    headersUnclaimed.innerHTML = "<b><center><font size='1'>UNCLAIMED</font></b>";
    headerRow.insertCell(-1).appendChild(headersUnclaimed);

    table.appendChild(headerRow);

    for (ka = 0; ka < ECO_WALLET.length; ka++) {
        if (ECO_WALLET[ka].print == true && !isEncryptedOnly(ka)) {
            var txRow = table.insertRow(-1);
            //row.insertCell(-1).appendChild(document.createTextNode(i));
            //Insert button that remove rule
            var b = document.createElement('button');
            b.setAttribute('content', 'test content');
            b.setAttribute('class', 'btn btn-danger btn-sm');
            b.setAttribute('value', ka);
            b.onclick = function() {
                removeAccountFromEcoWallet(this.value);
            };
            b.innerHTML = ECO_WALLET[ka].label;
            txRow.insertCell(-1).appendChild(b);

            var addressBase58 = document.createElement('button');
            addressBase58.setAttribute('content', 'test content');
            addressBase58.setAttribute('class', 'btn btn-success btn-sm');
            addressBase58.setAttribute('value', ka);
            addressBase58.setAttribute('id', "btnGetBalanceAddress" + ka);
            addressBase58.onclick = function() {
                getNep5TokensForAddress(this.value);
            };
            addressBase58.innerHTML = ECO_WALLET[ka].account.address.slice(0, 3) + "..." + ECO_WALLET[ka].account.address.slice(-3);
            txRow.insertCell(-1).appendChild(addressBase58);

            var walletNeo = document.createElement('span');
            walletNeo.setAttribute('id', "walletNeo" + ka);
            walletNeo.setAttribute("class", "badge");
            walletNeo.textContent = "-";
            txRow.insertCell(-1).appendChild(walletNeo);

            var walletGas = document.createElement('span');
            walletGas.setAttribute('id', "walletGas" + ka);
            walletGas.setAttribute("class", "badge");
            walletGas.textContent = "-";
            txRow.insertCell(-1).appendChild(walletGas);

            var walletUnclaim = document.createElement('span');
            walletUnclaim.setAttribute('id', "walletUnclaim" + ka);
            walletUnclaim.setAttribute("class", "badge");
            walletUnclaim.textContent = "-";
            txRow.insertCell(-1).appendChild(walletUnclaim);
        } //Check print and encrypted status
    } //Finishes loop that draws each relayed transaction

    //Clear previous data
    document.getElementById("tableWalletStatus").innerHTML = "";
    //Append new table
    document.getElementById("tableWalletStatus").appendChild(table);
} //Finishe DrawWallets function
//===============================================================

//===============================================================
//================ ADD NEW ADDRESS ==============================
function addWalletFromForm() {
    addressBase58ToAdd = document.getElementById('addressToAddBox').value;
    scriptHashToAdd = document.getElementById('scriptHashToAddBox').value;
    pubKeyToAdd = document.getElementById('pubKeyToAddBox').value;
    wifToAdd = document.getElementById('wifToAddBox').value;
    privKeyToAdd = document.getElementById('privKeyToAddBox').value;
    vsToAdd = document.getElementById('vsToAddBox').value;
    encryptedKeyToAdd = document.getElementById('encryptedKeyToAddBox').value;
    multiSigFlag = $("#cbx_multisig")[0].checked;

    var accountToAdd;
    if (encryptedKeyToAdd != '') {
        accountToAdd = new Neon.wallet.Account(encryptedKeyToAdd);
    } else {
        if (multiSigFlag) {
            accountToAdd = getAccountFromMultiSigVerification(vsToAdd);
        } else {
            if (pubKeyToAdd != '' && wifToAdd === '') {
                accountToAdd = new Neon.wallet.Account(pubKeyToAdd);
            } else {
                if (addressBase58ToAdd != '' && wifToAdd === '') {
                    accountToAdd = new Neon.wallet.Account(addressBase58ToAdd);
                } else {
                    if (scriptHashToAdd != '' && wifToAdd === '') {
                        accountToAdd = new Neon.wallet.Account(scriptHashToAdd);
                    } else {
                        if (privKeyToAdd != '') {
                            accountToAdd = new Neon.wallet.Account(privKeyToAdd);
                        } else {
                            if (wifToAdd != '') {
                                accountToAdd = new Neon.wallet.Account(wifToAdd);
                            } else {
                                alert("Error when adding wallet. Values looks all empty.");
                                return false;
                            }
                        }
                    }
                }
            }
        }
    }

    if (addToWallet(accountToAdd))
        updateAllWalletData();
}

function cacheWalletForProviders() {
    // Updated cache of ECO_WALLET in case of user changing to providers
    window.storedECO_WALLET = ECO_WALLET;
}

function addContractToWallet(scriptHashToAdd) {
    var accountToAdd;
    if (scriptHashToAdd != '') {
        accountToAdd = new Neon.wallet.Account(scriptHashToAdd);
        labelToAdd = scriptHashToAdd.slice(0, 3) + "..." + scriptHashToAdd.slice(-3)
        if (addToWallet(accountToAdd, labelToAdd))
            drawPopulate();

        $('.nav a[href="#nav-wallet"]').tab('show');
    } else
        console.log("Nothing to add. Scripthash looks to be empty!");
}

function addContractToWalletFromVerification() {
    var verificationScriptToAdd = $("#createtx_from_contract").val();
    var scriptHashToAdd = getScriptHashFromAVM(verificationScriptToAdd);

    if (scriptHashToAdd != '') {
        var accountToAdd = new Neon.wallet.Account(scriptHashToAdd);
        if (addToWallet(accountToAdd, verificationScriptToAdd))
            updateAllWalletData();

        $('.nav-pills a[data-target="#wallet"]').tab('show');
    } else
        console.log("Nothing to add. Scripthash looks to be empty!");
}

//TODO Add suport for adding multisig and specialSC
function addToWallet(accountToAdd, labelToAdd, verificationScriptToAdd = "") {
    if (accountToAdd._encrypted != null) {
        if (searchAddrIndexFromEncrypted(accountToAdd.encrypted) != -1) {
            alert("Encrypted key already registered. Please, delete index " + searchAddrIndexFromEncrypted(accountToAdd.encrypted) + " first.");
            return false;
        }
        ECO_WALLET.push({
            account: accountToAdd,
            label: labelToAdd,
            print: true
        });
        return true;
    }
    var addressBase58ToAdd = accountToAdd.address;

    if (!accountToAdd.isMultiSig) {
        console.log("pubAddressToAdd: '" + addressBase58ToAdd + "'");
        if (accountToAdd._WIF != null) {
            var wifToAdd = accountToAdd.WIF;
            console.log("wifToAdd: " + wifToAdd);
            if (!Neon.default.is.wif(wifToAdd) && wifToAdd != '') {
                alert("This WIF " + wifToAdd + " does not seems to be valid.");
                return false;
            }
            //console.log(getWifIfKnownAddress(wifToAdd));
            if (wifToAdd == '') {
                alert("WIF is null.");
                return false;
            }

            if (searchAddrIndexFromWif(wifToAdd) != -1) {
                alert("WIF already registered. Please, delete index " + searchAddrIndexFromWif(wifToAdd) + " first.");
                return false;
            }
            console.log("wif " + wifToAdd + " is ok!");
        }

        //TODO Check if addressBase58 already exists by getting it from wif
        if (searchAddrIndexFromBase58(addressBase58ToAdd) != -1) {
            alert("Public addressBase58 already registered. Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.");
            return false;
        }

        if (!Neon.default.is.address(addressBase58ToAdd) && addressBase58ToAdd != '') {
            alert("Public addressBase58 " + addressBase58ToAdd + " is not being recognized as a valid address.");
            return false;
        }
        console.log("Address " + addressBase58ToAdd + " is ok!");

        if (accountToAdd._publicKey != null) {
            if (!Neon.default.is.publicKey(accountToAdd.publicKey) && accountToAdd.publicKey != '') {
                alert("Public key " + accountToAdd.publicKey + " is not being recognized as a valid address.");
                return false;
            }
            console.log("pubKey " + accountToAdd.publicKey + " is ok!");
        }

        if (verificationScriptToAdd != "")
            accountToAdd.contract.script = verificationScriptToAdd;

        ECO_WALLET.push({
            account: accountToAdd,
            label: labelToAdd,
            print: true
        });

        return true;
    }

    if (accountToAdd.isMultiSig) {
        var vsToAdd = accountToAdd.contract.script;
        if (vsToAdd == '') {
            alert("Verification script is empty for this multisig!");
            return false;
        }

        if (accountToAdd.address != toBase58(getScriptHashFromAVM(vsToAdd))) {
            alert("Error on converting verification script to base58");
            return false;
        }

        if (searchAddrIndexFromBase58(addressBase58ToAdd) != -1) {
            alert("Public addressBase58 already registered for this MultiSig. Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.");
            return false;
        }
        ECO_WALLET.push({
            account: accountToAdd,
            print: true,
            owners: ''
        });
        return true;
    }
}
//===============================================================

//===============================================================
//============= FUNCTION CALLED WHEN SELECTION BOX CHANGES ======
function changeWalletInfo() {
    var wToChangeIndex = $("#wallet_info")[0].selectedOptions[0].index;

    if (isEncryptedOnly(wToChangeIndex)) {
        $("#dialog").show();
        document.getElementById("walletInfoEncrypted").value = ECO_WALLET[wToChangeIndex].account.encrypted;
        document.getElementById("walletInfoAddressBase58").value = "-";
        document.getElementById("walletInfoScripthash").value = "-";
        document.getElementById("walletInfoPubKey").value = "-";
        document.getElementById("walletInfoWIF").value = "-";
        document.getElementById("walletInfoPrivateKey").value = "-";
        document.getElementById("addressPrintInfo").value = "-";
        document.getElementById("addressVerificationScript").value = "-";
        document.getElementById("addressOwners").value = "-";
    } else {

        document.getElementById("walletInfoAddressBase58").value = ECO_WALLET[wToChangeIndex].account.address;

        if (ECO_WALLET[wToChangeIndex].account._encrypted != null) {
            document.getElementById("walletInfoEncrypted").value = ECO_WALLET[wToChangeIndex].account.encrypted;
        } else {
            $("#dialog").hide();
            document.getElementById("walletInfoEncrypted").value = "-";
        }

        document.getElementById("walletInfoScripthash").value = ECO_WALLET[wToChangeIndex].account.scriptHash;

        if (!ECO_WALLET[wToChangeIndex].account.isMultiSig && ECO_WALLET[wToChangeIndex].account._publicKey != null)
            document.getElementById("walletInfoPubKey").value = ECO_WALLET[wToChangeIndex].account.publicKey;
        else
            document.getElementById("walletInfoPubKey").value = "-";

        if (!ECO_WALLET[wToChangeIndex].account.isMultiSig && ECO_WALLET[wToChangeIndex].account._WIF != null)
            document.getElementById("walletInfoWIF").value = ECO_WALLET[wToChangeIndex].account.WIF;
        else
            document.getElementById("walletInfoWIF").value = "-";

        if (!ECO_WALLET[wToChangeIndex].account.isMultiSig && ECO_WALLET[wToChangeIndex].account._privateKey != null)
            document.getElementById("walletInfoPrivateKey").value = ECO_WALLET[wToChangeIndex].account.privateKey;
        else
            document.getElementById("walletInfoPrivateKey").value = "-";

        document.getElementById("addressPrintInfo").value = ECO_WALLET[wToChangeIndex].print;
        document.getElementById("addressVerificationScript").value = ECO_WALLET[wToChangeIndex].account.contract.script;
        document.getElementById("addressOwners").value = JSON.stringify(ECO_WALLET[wToChangeIndex].owners);
    }
}
//===============================================================

//===============================================================
//============= UPDATE ALL KNOWN ADDRESSES ======================
function updateInfoMSOwners() {
    for (ka = 0; ka < ECO_WALLET.length; ++ka)
        if (!isEncryptedOnly(ka))
            if (ECO_WALLET[ka].account.isMultiSig)
                if (ECO_WALLET[ka].owners === '')
                    ECO_WALLET[ka].owners = getAddressBase58FromMultiSig(ECO_WALLET[ka].account.contract.script);
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function updateAddressSelectionBox() {
    updateInfoMSOwners();
    //Adding all known address to NeonInvokeSelectionBox
    //addAllKnownAddressesToSelectionBox("wallet_invokejs");
    //addAllKnownAddressesToSelectionBox("wallet_deployjs");
    //addAllKnownAddressesToSelectionBox("wallet_info");
    addAllKnownAddressesToSelectionBox("createtx_to");
    addAllKnownAddressesToSelectionBox("createtx_from");
    //addAllKnownAddressesToSelectionBox("wallet_advanced_signing");
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function addAllKnownAddressesToSelectionBox(walletSelectionBox) {
    //Clear selection box
    //var currentSelected = document.getElementById(walletSelectionBox).selectedOptions[0].index;
    document.getElementById(walletSelectionBox).options.length = 0;
    for (ka = 0; ka < ECO_WALLET.length; ++ka) {
        // Removing .slice(0, 4)
        // addOptionToSelectionBox("Encrypted: " + ECO_WALLET[ka].account.encrypted.slice(0, 4) + "..." + ECO_WALLET[ka].account.encrypted.slice(-4), "wallet_" + ka, walletSelectionBox);
        // addOptionToSelectionBox(ECO_WALLET[ka].account.address.slice(0, 4) + "..." + ECO_WALLET[ka].account.address.slice(-4), "wallet_" + ka, walletSelectionBox);
        if (isEncryptedOnly(ka))
            addOptionToSelectionBox("Encrypted: " + ECO_WALLET[ka].account.encrypted, "wallet_" + ka, walletSelectionBox);
        else
            addOptionToSelectionBox(ECO_WALLET[ka].account.address, "wallet_" + ka, walletSelectionBox);
    }
}
//===============================================================

function updateAllWalletData(updateCache = true) {
    populateAllWalletData();
    updateAddressSelectionBox();
    drawWalletsStatus();
    changeWalletInfo();

    if (updateCache)
        cacheWalletForProviders();
}

function populateAllWalletData() {
    for (ka = 0; ka < ECO_WALLET.length; ++ka)
        if (ECO_WALLET[ka].print == true && !isEncryptedOnly(ka)) {
            addressToGet = ECO_WALLET[ka].account.address;

            queryTofillNeoGasNep17FromNeoCli(addressToGet, ka);
            callUnclaimedFromNeoCli(addressToGet, ka);
        }
}

//===============================================================
function deleteAccount(idToRemove) {
    ECO_WALLET.splice(idToRemove, 1);
    drawPopulate();
}

function removeAccountFromEcoWallet(idToRemove) {
    if (idToRemove < ECO_WALLET.length && idToRemove > -1) {
        swal({
            title: "Delete " + ECO_WALLET[idToRemove].label + "?",
            text: " Address " + ECO_WALLET[idToRemove].account.address + " will be removed.",
            type: "warning",
            buttons: ["Cancel", "Delete it!"],
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                deleteAccount(idToRemove);
                swal("Address has been deleted!", {
                    icon: "success",
                });
            } else {
                swal("Safe! Account " + ECO_WALLET[idToRemove].label + " was not deleted.");
            }
        });
    } else {
        alert("Cannot remove TX with ID " + idToRemove + " from set of known addresses with size " + ECO_WALLET.length)
    }
}
//===============================================================

function decrypt() {
    var idToDecrypt = $("#wallet_info")[0].selectedOptions[0].index;
    var encryptedKey = ECO_WALLET[idToDecrypt].account.encrypted;
    var passValue = $("#passwordNep2").val();
    $("#passwordNep2").val("");
    console.log("idToDecrypt: " + idToDecrypt + " encryptedKey " + encryptedKey);
    console.log("passValue: " + passValue);

    ECO_WALLET[idToDecrypt].account.decrypt(passValue).then(decryptedWallet => {
        removeAccountFromEcoWallet(idToDecrypt);
        addToWallet(decryptedWallet);
        updateAllWalletData();
        createNotificationOrAlert("Wallet decrypted!", "Address: " + decryptedWallet.address, 5000);
    }).catch(err => {
        console.log(err);
        createNotificationOrAlert("Wallet decryptation ERROR", "Response: " + err, 5000);
    });
}

function getAddressBase58FromMultiSig(verificationScript) {
    jssonArrayWithAddr = [];
    var jssonArrayWithPubKey = getPubKeysFromMultiSig(verificationScript);
    for (a = 0; a < jssonArrayWithPubKey.length; a++)
        jssonArrayWithAddr.push(new Neon.wallet.Account(jssonArrayWithPubKey[a].pubKey));
    return jssonArrayWithAddr;
}

function getAccountFromMultiSigVerification(verificationScript) {
    var jssonArrayWithAddr = getAddressBase58FromMultiSig(verificationScript);
    var rawPubKeysForNeonJS = [];

    // Create publicKeys: string[]
    for (var a = 0; a < jssonArrayWithAddr.length; a++)
        rawPubKeysForNeonJS.push(jssonArrayWithAddr[a].publicKey);

    var nRequiredSignatures = getNRequiredSignatures(verificationScript);
    return Neon.wallet.Account.createMultiSig(Number(nRequiredSignatures), rawPubKeysForNeonJS);
}

function generateRandomAccounts(nAccounts) {
    var randomAccounts = [];

    for (var o = 0; o < nAccounts; o++)
        randomAccounts.push(new Neon.wallet.Account(Neon.wallet.generatePrivateKey()));

    return randomAccounts;
}

function generateMultiSigFromAccounts(threshold, accounts) {
    var pubKeys = [];

    for (var o = 0; o < accounts.length; o++)
        pubKeys.push(accounts[o].publicKey)

    return Neon.wallet.Account.createMultiSig(threshold, pubKeys);
}

function createWallet(walletName, accounts) {
    return Neon.default.create.wallet({ name: walletName, accounts: accounts });
}

function createRandomWalletsForValidators(nAccounts, threshold) {
    var randomAccount = generateRandomAccounts(nAccounts);
    randomAccount.push(generateMultiSigFromAccounts(threshold, randomAccount));
    var randomWallets = [];

    for (var o = 0; o < (randomAccount.length - 1); o++) {
        var tempAccounts = [];
        tempAccounts.push(randomAccount[0]);
        tempAccounts.push(randomAccount[randomAccount.length - 1]);
        randomWallets.push(createWallet("wallet" + o, tempAccounts));
    }


    for (var w = 0; w < randomWallets.length; w++) {
        randomWallets[w].accounts[0].encrypt(w);
    }

    return randomWallets;
}

function fillSpanTextOrInputBox(boxToFill, contentToFill, amountUnclaimable = -1) {
    if (boxToFill != "") {
        if (boxToFill != "#createtx_NEO" && boxToFill != "#createtx_GAS") {
            $(boxToFill)[0].innerHTML = contentToFill;
            if (amountUnclaimable != -1)
                $(boxToFill).val(amountUnclaimable);
        } else {
            $(boxToFill).val(contentToFill);
        }
    }
}

function fillAllNeo() {
    var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
    getAllNeoOrGasFromNeoCli(ECO_WALLET[addrFromIndex].account.address, "NEO", "#createtx_NEO");
}

function fillAllGas() {
    var addrFromIndex = $("#createtx_from")[0].selectedOptions[0].index;
    getAllNeoOrGasFromNeoCli(ECO_WALLET[addrFromIndex].account.address, "GAS", "#createtx_GAS");
}

function selfTransfer(idToTransfer) {
    if (idToTransfer < ECO_WALLET.length && idToTransfer > -1) {
        getAllNeoOrGasFromNeoCli(ECO_WALLET[idToTransfer].account.address, "NEO", "", true);
    } else {
        alert("Cannot transfer anything from " + idToTransfer + " from set of known addresses with size " + ECO_WALLET.length)
    }
}

function drawPopulate() {
    drawWalletsStatus();
    populateAllWalletData();
    updateAddressSelectionBox();
}

drawPopulate()