//===============================================================
function drawWalletsStatus() {
    var table = document.createElement("table");
    table.setAttribute('class', 'table');
    table.style.width = '20px';

    var row = table.insertRow(-1);
    var headersID = document.createElement('div');
    var headersNeoBalance = document.createElement('div');
    var headersGasBalance = document.createElement('div');
    var headersUnclaimed = document.createElement('div');
    var headersUnavailable = document.createElement('div');
    var headersAddress = document.createElement('div');
    headersID.innerHTML = "<b><center><font size='1' color='green'>ID</font></b>";
    row.insertCell(-1).appendChild(headersID);
    headersAddress.innerHTML = "<b><center><font size='1' color='green'>ADDRESS</font></b>";
    row.insertCell(-1).appendChild(headersAddress);
    headersNeoBalance.innerHTML = "<b><center><font size='1' color='green'>NEO</font></b>";
    row.insertCell(-1).appendChild(headersNeoBalance);
    headersGasBalance.innerHTML = "<b><center><font size='1' color='green'>GAS</font></b>";
    row.insertCell(-1).appendChild(headersGasBalance);
    headersUnclaimed.innerHTML = "<b><center><font size='1' color='green'>UNCLAIMED</font></b>";
    row.insertCell(-1).appendChild(headersUnclaimed);
    headersUnavailable.innerHTML = "<b><center><font size='1' color='green'>UNAVAILABLE</font></b>";
    row.insertCell(-1).appendChild(headersUnavailable);

    for (ka = 0; ka < ECO_WALLET.length; ka++) {
        if (ECO_WALLET[ka].print == true && !isEncryptedOnly(ka)) {
            var txRow = table.insertRow(-1);
            //row.insertCell(-1).appendChild(document.createTextNode(i));
            //Insert button that remove rule
            var b = document.createElement('button');
            b.setAttribute('content', 'test content');
            b.setAttribute('class', 'btn btn-danger btn-sm');
            b.setAttribute('value', ka);
            //b.onclick = function () {buttonRemoveRule();};
            //b.onclick = function () {alert(this.value);};
            b.onclick = function() {
                removeAccountFromEcoWallet(this.value);
            };
            b.innerHTML = ka;
            txRow.insertCell(-1).appendChild(b);

            var addressBase58 = document.createElement('button');
            addressBase58.setAttribute('content', 'test content');
            addressBase58.setAttribute('class', 'btn btn-success btn-sm');
            addressBase58.setAttribute('value', i);
            addressBase58.setAttribute('id', "btnGetBalanceAddress" + i);
            addressBase58.onclick = function() {
                getUnspentsForAddress(this.value);
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

            var walletClaim = document.createElement('span');
            walletClaim.setAttribute('id', "walletClaim" + ka);
            walletClaim.setAttribute("class", "badge");
	    walletClaim.textContent = "-";
            txRow.insertCell(-1).appendChild(walletClaim);

            var walletUnclaim = document.createElement('span');
            walletUnclaim.setAttribute('id', "walletUnclaim" + ka);
            walletUnclaim.setAttribute("class", "badge");
	    walletUnclaim.textContent = "-";
            txRow.insertCell(-1).appendChild(walletUnclaim);
        } //Check print and encrypted status
    } //Finishes loop that draws each relayed transaction

    //Clear previous data
    document.getElementById("divWalletsStatus").innerHTML = "";
    //Append new table
    document.getElementById("divWalletsStatus").appendChild(table);
} //Finishe DrawWallets function
//===============================================================

//===============================================================
//Call address balance
function getUnspentsForAddress(addressID) {
    if (addressID < ECO_WALLET.length && addressID > -1) {
        var requestJson = "{ \"jsonrpc\": \"2.0\", \"id\": 5, \"method\": \"getunspents\", \"params\": [\"" + ECO_WALLET[addressID].account.address + "\"] }";
        $("#txtRPCJson").val(requestJson);
        $('#btnCallJsonRPC').click();
        $('.nav-pills a[data-target="#rawRPC"]').tab('show');
    } else {
        alert("Cannot get unspents of addrs with ID " + addressID + " from set of address with size " + ECO_WALLET.length)
    }
}
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

    var addedFlag = addToWallet(accountToAdd);
    if (addedFlag)
        updateAllWalletData();
}

function addContractToWallet(scriptHashToAdd) {

    var accountToAdd;
    if (scriptHashToAdd != '')
    {
	accountToAdd = new Neon.wallet.Account(scriptHashToAdd);
	if (addToWallet(accountToAdd))
        	updateAllWalletData();

        $('.nav-pills a[data-target="#wallet"]').tab('show');
    }else
	console.log("Nothing to add. Scripthash looks to be empty!");
}

//TODO Add suport for adding multisig and specialSC
function addToWallet(accountToAdd) {
    if (accountToAdd._encrypted != null) {
        if (searchAddrIndexFromEncrypted(accountToAdd.encrypted) != -1) {
            alert("Encrypted key already registered. Please, delete index " + searchAddrIndexFromEncrypted(accountToAdd.encrypted) + " first.");
            return false;
        }
        ECO_WALLET.push({
            account: accountToAdd,
            print: true
        });
        return true;
    }

    if (!accountToAdd.isMultiSig) {
        var addressBase58ToAdd = accountToAdd.address;

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


        ECO_WALLET.push({
            account: accountToAdd,
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
    addAllKnownAddressesToSelectionBox("wallet_invokejs");
    addAllKnownAddressesToSelectionBox("wallet_deployjs");
    addAllKnownAddressesToSelectionBox("wallet_info");
    addAllKnownAddressesToSelectionBox("createtx_to");
    addAllKnownAddressesToSelectionBox("createtx_from");
}
//===============================================================

//===============================================================
//============= UPDATE ALL SELECTION BOX THAT SHOWS ADDRESSES ===
function addAllKnownAddressesToSelectionBox(walletSelectionBox) {
    //Clear selection box
    //var currentSelected = document.getElementById(walletSelectionBox).selectedOptions[0].index;
    document.getElementById(walletSelectionBox).options.length = 0;
    for (ka = 0; ka < ECO_WALLET.length; ++ka) {
        if (isEncryptedOnly(ka))
            addOptionToSelectionBox("Encrypted: " + ECO_WALLET[ka].account.encrypted.slice(0, 4) + "..." + ECO_WALLET[ka].account.encrypted.slice(-4), "wallet_" + ka, walletSelectionBox);
        else
            addOptionToSelectionBox(ECO_WALLET[ka].account.address.slice(0, 4) + "..." + ECO_WALLET[ka].account.address.slice(-4), "wallet_" + ka, walletSelectionBox);
    }
    //document.getElementById(walletSelectionBox)[0].selectedIndex = 0; //currentSelected
}
//===============================================================

function updateAllWalletData() {
    populateAllWalletData();
    updateAddressSelectionBox();
    drawWalletsStatus();
    changeWalletInfo();
}

function populateAllWalletData() {
    for (ka = 0; ka < ECO_WALLET.length; ++ka)
        if (ECO_WALLET[ka].print == true && !isEncryptedOnly(ka)) {
            addressToGet = ECO_WALLET[ka].account.address;
            getAllNeoOrGasFromNeoCli(addressToGet, "NEO", "#walletNeo" + ka);
            getAllNeoOrGasFromNeoCli(addressToGet, "GAS", "#walletGas" + ka);

            if(!$("#cbx_query_neoscan")[0].checked)
              callClaimableFromNeoCli(addressToGet, "#walletClaim" + ka);
            else
              callClaimableFromNeoScan(addressToGet, "#walletClaim" + ka);

            if(!$("#cbx_query_neoscan")[0].checked)
              callUnclaimedFromNeoCli(addressToGet, "#walletUnclaim" + ka, ka);
            else
              callUnclaimedFromNeoScan(addressToGet, "#walletUnclaim" + ka, ka);
        }
}

//===============================================================
function removeAccountFromEcoWallet(idToRemove) {
    if (idToRemove < ECO_WALLET.length && idToRemove > -1) {
        ECO_WALLET.splice(idToRemove, 1);
        updateAllWalletData();
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

