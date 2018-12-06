//==========================================================================
//Call for Genesis Block
//genesisBlockTransfer("AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU","AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y");
function genesisBlockTransfer(genesisAddress, newOwner){
	//console.log("Inside Genesis Block Transfers");
	//Verification on the front-end if wallets already have funds, then, skip transfer
	//console.log("newOwnerIndex: " + searchAddrIndexFromBase58(newOwner));
	newOwnerNeoBalance = $("#walletNeo" + searchAddrIndexFromBase58(newOwner)).val();
	newOwnerGasBalance = $("#walletGas" + searchAddrIndexFromBase58(newOwner)).val();
	//console.log("newOwnerNEO with address: " + newOwner + " balance is: " + newOwnerNeoBalance);
	//console.log("newOwnerGAS with address: " + newOwner + " balance is: " + newOwnerGasBalance);
	if( (newOwnerNeoBalance > 0) && (newOwnerGasBalance > 0))
	{
		clearInterval(refreshGenesisBlock);
	}
	else
	{
		if(!(newOwnerNeoBalance > 0))
			getAllNeoOrGasFrom(genesisAddress,"NEO","",true,newOwner);

		if(!(newOwnerGasBalance > 0))
			getAllNeoOrGasFrom(genesisAddress,"GAS","",true,newOwner);
	}

	//var genesisAddressIndex = searchAddrIndexFromBase58(genesisAddress);
	//var jsonArrayWithPrivKeys = getMultiSigPrivateKeys(genesisAddressIndex);

	//createMultiSigSendingTransaction(KNOWN_ADDRESSES[4].account.contract.script, jsonArrayWithPrivKeys, newOwner, 100000000, "NEO", getCurrentNetworkNickname());
	//getAllNeoOrGasFrom("AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU","GAS","",true,"AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y");
	//getAllNeoOrGasFrom("AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU","NEO","",true,"AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y");
	//createMultiSigSendingTransaction(KNOWN_ADDRESSES[4].account.contract.script, jsonArrayWithPrivKeys, newOwner, allGas, "GAS", getCurrentNetworkNickname());

	//Claim will be automatic if frontend is open
	//createMultiSigClaimingTransaction(KNOWN_ADDRESSES[4].account.contract.script, jsonArrayWithPrivKeys, getCurrentNetworkNickname());
}
//==========================================================================
