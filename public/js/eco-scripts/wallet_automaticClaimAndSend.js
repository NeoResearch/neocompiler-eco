function fillSpanTextOrInputBox(boxToFill, contentToFill, amountUnclaimable = -1)
{
	if (boxToFill != "")
	{
		if(boxToFill != "#createtx_NEO" && boxToFill != "#createtx_GAS")
		{
			$(boxToFill)[0].innerHTML = contentToFill;
			if(amountUnclaimable != -1)
				$(boxToFill).val(amountUnclaimable);
		}
		else
		{
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
