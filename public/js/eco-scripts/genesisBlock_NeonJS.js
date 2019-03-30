//==========================================================================
//Call for Genesis Block
//genesisBlockTransfer("AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU","AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y");
function genesisBlockTransfer(genesisAddress, newOwner) {
    //console.log("Inside Genesis Block Transfers");
    //Verification on the front-end if wallets already have funds, then, skip transfer
    //console.log("newOwnerIndex: " + searchAddrIndexFromBase58(newOwner));
    newOwnerNeoBalance = $("#walletNeo" + searchAddrIndexFromBase58(newOwner)).val();
    newOwnerGasBalance = $("#walletGas" + searchAddrIndexFromBase58(newOwner)).val();
    //console.log("newOwnerNEO with address: " + newOwner + " balance is: " + newOwnerNeoBalance);
    //console.log("newOwnerGAS with address: " + newOwner + " balance is: " + newOwnerGasBalance);
    if ((newOwnerNeoBalance > 0) && (newOwnerGasBalance > 0)) {
        clearInterval(refreshGenesisBlock);
	$("#cbx_refresh_gen").val(0);
    } else {
        if (!(newOwnerNeoBalance > 0))
            getAllNeoOrGasFromNeoCli(genesisAddress, "NEO", "", true, newOwner);

        if (!(newOwnerGasBalance > 0))
            getAllNeoOrGasFromNeoCli(genesisAddress, "GAS", "", true, newOwner);
    }

    //var genesisAddressIndex = searchAddrIndexFromBase58(genesisAddress);
    //var jsonArrayWithPrivKeys = getMultiSigPrivateKeys(genesisAddressIndex);

    //createMultiSigSendingTransaction(ECO_WALLET[4].account.contract.script, jsonArrayWithPrivKeys, newOwner, 100000000, "NEO", getCurrentNetworkNickname());
    //getAllNeoOrGasFromNeoCli("AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU","GAS","",true,"AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y");
    //getAllNeoOrGasFromNeoCli("AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU","NEO","",true,"AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y");
    //createMultiSigSendingTransaction(ECO_WALLET[4].account.contract.script, jsonArrayWithPrivKeys, newOwner, allGas, "GAS", getCurrentNetworkNickname());

    //Claim will be automatic if frontend is open
    //createMultiSigClaimingTransaction(ECO_WALLET[4].account.contract.script, jsonArrayWithPrivKeys, getCurrentNetworkNickname());
}
//==========================================================================
