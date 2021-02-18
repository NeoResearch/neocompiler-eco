var CONNECTED_WALLET_ID = -1;

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
    headersAddress.innerHTML = "<b><center><font size='1'>SELECT ADDRESS</font></b>";
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
                changeDefaultWallet(this.value);
            };
            addressBase58.innerHTML = ECO_WALLET[ka].account.address.slice(0, 4) + "..." + ECO_WALLET[ka].account.address.slice(-4);
            txRow.insertCell(-1).appendChild(addressBase58);

            var walletNeo = document.createElement('span');
            walletNeo.setAttribute('id', "walletNEO" + ka);
            walletNeo.setAttribute("class", "badge");
            walletNeo.textContent = "-";
            txRow.insertCell(-1).appendChild(walletNeo);

            var walletGas = document.createElement('span');
            walletGas.setAttribute('id', "walletGAS" + ka);
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
    var type = $("#type_to_register")[0].value;
    var keyToAdd = $("#accountToAddInfo")[0].value;
    var accountToAdd;
    switch (type) {
        case 'publickey':
        case 'address':
        case 'scripthash':
        case 'privatekey':
        case 'wif':
        case 'encryptedkey':
            accountToAdd = new Neon.wallet.Account(keyToAdd);
            break;
        case 'multisig':
            accountToAdd = getAccountFromMultiSigVerification(keyToAdd);
            break;
        default:
            console.error("Account to with not found type.")
    }

    var labelToAdd = keyToAdd = $("#accountLabelToAddInfo")[0].value;
    if (labelToAdd === "")
        labelToAdd = "ImportedWallet_From_" + type;
    if (addToWallet(accountToAdd, labelToAdd))
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

/*
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
}*/


//TODO Add suport for adding multisig and specialSC
function addToWallet(accountToAdd, labelToAdd, verificationScriptToAdd = "") {
    if (accountToAdd._encrypted != null) {
        if (searchAddrIndexFromEncrypted(accountToAdd.encrypted) != -1) {
            swal({
                title: "Encrypted key already registered.",
                text: " Please, delete index " + searchAddrIndexFromEncrypted(accountToAdd.encrypted) + " first.",
                icon: "error",
                button: "Ok!",
                timer: 5500,
            });
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
                swal({
                    title: "WIF already registered.",
                    text: "Please, delete index " + searchAddrIndexFromWif(wifToAdd) + " first.",
                    icon: "error",
                    button: "Ok!",
                    timer: 5500,
                });
                return false;
            }
            console.log("wif " + wifToAdd + " is ok!");
        }

        //TODO Check if addressBase58 already exists by getting it from wif
        if (searchAddrIndexFromBase58(addressBase58ToAdd) != -1) {
            swal({
                title: "Public addressBase58 already registered.",
                text: "Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.",
                icon: "error",
                button: "Ok!",
                timer: 5500,
            });
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
            swal({
                title: "Public addressBase58 already registered for this MultiSig.",
                text: "Please, delete index " + searchAddrIndexFromBase58(addressBase58ToAdd) + " first.",
                icon: "error",
                button: "Ok!",
                timer: 5500,
            });
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

/*
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
}*/
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
    //updateInfoMSOwners();
    addAllKnownAddressesToSelectionBox("createtx_to");
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function addAllKnownAddressesToSelectionBox(walletSelectionBox) {
    document.getElementById(walletSelectionBox).options.length = 0;
    for (ka = 0; ka < ECO_WALLET.length; ++ka) {
        var keyToAdd;
        if (isEncryptedOnly(ka))
            keyToAdd = ECO_WALLET[ka].account.encrypted;
        else
            keyToAdd = ECO_WALLET[ka].account.address;
        //.slice(0, 4) + "..." + keyToAdd.slice(-4)
        var addressInfoToAdd = ECO_WALLET[ka].label + " - " + keyToAdd;
        var titleToOption = "Click to select wallet " + ECO_WALLET[ka].label;

        addOptionToSelectionBox(addressInfoToAdd, "wallet_" + ka, walletSelectionBox, titleToOption);
    }
    document.getElementById(walletSelectionBox).selectedIndex = 0;
    document.getElementById(walletSelectionBox).onchange();
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

function addAssetsToTransfer(valueToOption) {
    var option = document.createElement("option");
    option.text = valueToOption;
    option.value = valueToOption;
    $("#nep17_asset")[0].appendChild(option);
}

function updateTransferAssetInfo() {
    var selectedAsset = $("#nep17_asset")[0].value;
    $("#labelForTransferAsset")[0].textContent = selectedAsset;
    $("#transfer_nep17_amount")[0].value = 0;
    updateTransferAmountInfo();
}

function updateTransferAmountInfo() {
    $("#labelForTransferAmount")[0].textContent = "- Will send " + $("#transfer_nep17_amount")[0].value;
}

function updateTransferLabel() {
    $("#labelForTransferFrom")[0].textContent = "Sending from " + ECO_WALLET[CONNECTED_WALLET_ID].label;
    // Updating with all know NEP 17 options
    $("#nep17_asset")[0].length = 0;
    addAssetsToTransfer("NEO");
    addAssetsToTransfer("GAS");
    // Update label
    updateTransferAssetInfo();
}



function fillTransferToLabel() {
    var addrToIndex = $("#createtx_to")[0].selectedOptions[0].index;
    $("#labelForTransferTo")[0].textContent = "To " + ECO_WALLET[addrToIndex].label;
}

function fillAllNeo() {
    $("#createtx_NEO")[0].value = $("#walletNEO" + CONNECTED_WALLET_ID)[0].innerHTML;
}

function fillAllGas() {
    $("#createtx_GAS")[0].value = $("#walletGAS" + CONNECTED_WALLET_ID)[0].innerHTML;
}

function selfTransfer(idToTransfer) {
    if (idToTransfer < ECO_WALLET.length && idToTransfer > -1) {
        // Perform Self Transfer of NEO and GAS will be claimed
    } else {
        swal({
            title: "Cannot self-transfer anything from " + idToTransfer + " from set of known addresses with size " + ECO_WALLET.length,
            icon: "error",
            button: "Ok!",
            timer: 5500,
        });
    }
}

function drawPopulate() {
    drawWalletsStatus();
    populateAllWalletData();
    updateAddressSelectionBox();
}

function connectWallet() {
    goToTabAndClick("nav-wallet");
    changeDefaultWallet(0, true);
}

function changeDefaultWallet(walletID, skipSwal = false) {
    CONNECTED_WALLET_ID = walletID;
    $("#button-connect-wallet")[0].textContent = ECO_WALLET[CONNECTED_WALLET_ID].account.address.slice(0, 4) + "..." + ECO_WALLET[CONNECTED_WALLET_ID].account.address.slice(-4);
    updateTransferLabel();
}

drawPopulate();

function checkIfWalletIsConnected() {
    if (CONNECTED_WALLET_ID == -1) {
        swal("Connect a wallet and account first.", {
            icon: "error",
            buttons: false,
            timer: 5500,
        });
        return false;
    }
    return true;
}

function createNep17Tx() {
    if (!checkIfWalletIsConnected())
        return false;

    var amountToTransfer = $("#transfer_nep17_amount")[0].value;
    if ($("#transfer_nep17_amount")[0].value == 0) {
        swal("Transfer amount is currently 0", {
            icon: "error",
            buttons: false,
            timer: 5500,
        });
        return false;
    }

    swal({
        title: "Transfer from " + ECO_WALLET[CONNECTED_WALLET_ID].label,
        text: "Will send " + amountToTransfer + " " + $("#labelForTransferAsset")[0].textContent + $("#labelForTransferTo")[0].textContent,
        type: "info",
        buttons: ["Cancel!", "Proceed", ],
    }).then((willTransfer) => {
        if (willTransfer) {

            var addrToIndex = $("#createtx_to")[0].selectedOptions[0].index;

            var params = [{
                    type: "Hash160",
                    value: ECO_WALLET[CONNECTED_WALLET_ID].account.scriptHash
                },
                {
                    type: "Hash160",
                    value: ECO_WALLET[addrToIndex].account.scriptHash
                },
                {
                    type: "Integer",
                    value: amountToTransfer
                },
                {
                    type: "Integer",
                    value: 1
                },
            ];

            var contractHash = getNep17HashByName($("#labelForTransferAsset")[0].textContent);
            var method = "transfer";

            invokeFunctionWithParams(contractHash, method, params);

            swal("Transfer is being created!", {
                icon: "success",
            });
        } else {
            swal("Ok! Cancelled.");
        }
    });
}