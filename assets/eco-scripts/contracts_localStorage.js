function getAdditionalContractByCurrentNetwork() {
    var idToGet = "myadditionalcontracts" + $("#ecolabnetworkurlselection")[0].selectedIndex;
    var myAdditionalContractByNetwork = getLocalStorage(idToGet);
    if (myAdditionalContractByNetwork)
        return JSON.parse(myAdditionalContractByNetwork)

    return [];
}

function btnAdditionalContractsSave() {
    var idToSave = "myadditionalcontracts" + $("#ecolabnetworkurlselection")[0].selectedIndex;
    setLocalStorage(idToSave, JSON.stringify(ADDITIONAL_SEARCHED_CONTRACTS));
}

function restoreContractsLocalStorage() {
    ADDITIONAL_SEARCHED_CONTRACTS = getAdditionalContractByCurrentNetwork();

    if (ADDITIONAL_SEARCHED_CONTRACTS != []) {
        //$('#hidden_notification_contracts').collapse('show');
        CONTRACTS_TO_LIST = ADDITIONAL_SEARCHED_CONTRACTS;
        addContractsToSelectionBox("notification_contracts", "additional");
    }
}

function btnAdditionalContractsClean() {
    ADDITIONAL_SEARCHED_CONTRACTS = [];
    btnAdditionalContractsSave();
    
    tryToCleanContractSelectionBoxes();

    $("#native_contracts")[0].selectedIndex = 0;
    createNativeManifest();
}