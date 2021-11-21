function setRole(role) {

    if (NATIVE_CONTRACTS.length == 0) {
        swal("Wait for Native Contracts to be loaded. Call me again.", {
            icon: "error",
            buttons: false,
            timer: 1500,
        });
        getNativeInfo()
        return;
    }

    // Changing to MultiSig Wallet
    changeDefaultWallet(ECO_WALLET.length - 1, true);

    var oracleIndex = searchAddrIndexFromLabel("OraclePub");

    var roleManagementID = getNativeContractIndexByName("RoleManagement");

    var finalParams = [];
    var itemRoleId = { type: "Integer", value: role };
    finalParams.push(itemRoleId);
    var pubKeyArrays = [];
    var oraclePub = { type: "PublicKey", value: ECO_WALLET[oracleIndex].account._publicKey };
    pubKeyArrays.push(oraclePub);
    var arrayItem = { type: "Array", value: pubKeyArrays };
    finalParams.push(arrayItem);


    invokeFunctionWithParams(NATIVE_CONTRACTS[roleManagementID].hash, "designateAsRole", finalParams, true);
}