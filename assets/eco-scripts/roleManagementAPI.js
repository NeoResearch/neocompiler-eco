function setRole(role) {
    if (NATIVE_CONTRACTS.length == 0) {
        swal2Simple("Native Contract loading...", "Wait for Native Contracts to be loaded. Call me again.", 5500, "error");
        getNativeInfo()
        return;
    }

    // Changing to MultiSig Wallet
    changeDefaultWallet(ECO_WALLET.length - 1, true);

    var serviceIndex = searchAddrIndexFromLabel("OraclePub");

    var roleManagementID = getNativeContractIndexByName("RoleManagement");

    var finalParams = [];
    var itemRoleId = { type: "Integer", value: role };
    finalParams.push(itemRoleId);
    var pubKeyArrays = [];
    var servicePubKey = { type: "PublicKey", value: ECO_WALLET[serviceIndex].account._publicKey };
    pubKeyArrays.push(servicePubKey);
    var arrayItem = { type: "Array", value: pubKeyArrays };
    finalParams.push(arrayItem);


    invokeFunctionWithParams(NATIVE_CONTRACTS[roleManagementID].hash, "designateAsRole", finalParams, true);
}