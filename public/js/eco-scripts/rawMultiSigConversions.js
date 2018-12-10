function fillSignaturesForMultiSign(wtx, currentInvocationScript, privateKeyOfSigner){	
	var signature = Neon.wallet.sign(wtx, privateKeyOfSigner);
	currentInvocationScript.push(signature);
	return currentInvocationScript;
}

function getNRequiredSignatures(verificationScript){
    	nextPKeyIndex = verificationScript.indexOf(21);
	//Consider 52 is 2 signatures, 53 is 3, 511 would be 11 (TODO CHECK WITH IGOR)
	nRequiredSignatures = verificationScript.substr(1,nextPKeyIndex-1);
	return nRequiredSignatures;
}

function getPubKeysFromMultiSig(verificationScript)
{
	nRequiredSignatures = getNRequiredSignatures(verificationScript);
        jssonArrayWithPubKey = [];

    	nextPKeyIndex = verificationScript.indexOf(21);
	while(nextPKeyIndex != -1)
	{
		pKeyNBytes=33;
		//get the pKeyNBytes opcodes
		nextPKey = verificationScript.substr(nextPKeyIndex+2,pKeyNBytes*2)
        	jssonArrayWithPubKey.push({pubKey: nextPKey});

		verificationScript = verificationScript.substr(pKeyNBytes*2 + nextPKeyIndex+2);
		nextPKeyIndex = verificationScript.indexOf(21);
        }

	//console.log(verificationScript);
	nObtainedSignatures = jssonArrayWithPubKey.length.toLocaleString();
	//get number of signatures - jump 5 and get number
	nSignatures = verificationScript.substr(1, nObtainedSignatures.length)
	if(nSignatures != nObtainedSignatures)
		alert("Error on number of signatures at getPubKeysFromMultiSig!");

	//console.log(arrayPubKey);
	return jssonArrayWithPubKey;
}

function getMultiSigPrivateKeys(multiSigIndex){
            jsonArrayWithPrivKeys = [];
	    if(ECO_WALLET[multiSigIndex].type === "multisig")
	    {
		for(o=0;o<ECO_WALLET[multiSigIndex].owners.length;o++)
		{
			privateKeyToGet = getWifIfKnownAddress(ECO_WALLET[multiSigIndex].owners[o].addressBase58);
			if(privateKeyToGet!=-1)
				jsonArrayWithPrivKeys.push({privKey: privateKeyToGet});
		}
	    }else
		alert("Index" + multiSigIndex + " is not a multisig address! getMultiSigPrivateKeys");

	   return jsonArrayWithPrivKeys;
}

function getAddressBase58FromMultiSig(verificationScript)
{
	jssonArrayWithAddr = [];
	jssonArrayWithPubKey = getPubKeysFromMultiSig(verificationScript);
	for(a=0;a<jssonArrayWithPubKey.length;a++)
		jssonArrayWithAddr.push({addressBase58: toBase58FromPublicKey(jssonArrayWithPubKey[a].pubKey)});
	return jssonArrayWithAddr;
}

function sortMultiSigInvocationScript(wtx,invocationScript, verificationScript){
        arrayPubKey = getPubKeysFromMultiSig(verificationScript);
	jsonWithOrderedSignatures = [];

	for(a=0;a<arrayPubKey.length;a++)
	{
		currentInvocationScript = invocationScript;
		nextSignatureIndex = currentInvocationScript.indexOf(40);
		while(nextSignatureIndex != -1)
		{
			signatureNBytes=64;
			nextSignature = currentInvocationScript.substr(nextSignatureIndex+2,signatureNBytes*2);
			currentInvocationScript = currentInvocationScript.substr(signatureNBytes*2 + nextSignatureIndex+2);

			console.log(nextSignature);
			if(Neon.wallet.verify(wtx, nextSignature, arrayPubKey[a].account.publicKey))
			{
				jsonWithOrderedSignatures.push({privKey: nextSignature});
				break;//exit while
			}
			nextSignatureIndex = currentInvocationScript.indexOf(40);
		}
	}

	console.log(jsonWithOrderedSignatures);

	//=====================================================
	//========= Delete any exceding number of signatures ==
	nRequiredSignatures = getNRequiredSignatures(verificationScript);
	if(jsonWithOrderedSignatures.length > nRequiredSignatures)
	{
		console.log("Deleting excedding signatures  " + jsonWithOrderedSignatures.length + "/" + nRequiredSignatures);
		signaturesToDelete = jsonWithOrderedSignatures.length - nRequiredSignatures;
		for(d=0;d<signaturesToDelete;d++)
			delete jsonWithOrderedSignatures.splice(d, 1);

		console.log(jsonWithOrderedSignatures);
	}else{
		if(jsonWithOrderedSignatures.length < nRequiredSignatures)
		{
			console.log("Missings signatures  " + jsonWithOrderedSignatures.length + "/" + nRequiredSignatures);
		}
	}
	//=====================================================

	//=====================================================
	finalIS = "";
	for(a=0;a<jsonWithOrderedSignatures.length;a++)
		finalIS += "40" + jsonWithOrderedSignatures[a].privKey;
	//=====================================================

	//Neon.wallet.verifySignature(wtx, signature, pubKeyOfSigner)
	return finalIS;
}
