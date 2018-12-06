function searchAddrIndexFromBase58(addressBase58ToTryToGet)
{
  for(iToFind = 0; iToFind < KNOWN_ADDRESSES.length; ++iToFind)
      if(KNOWN_ADDRESSES[iToFind].account.address == addressBase58ToTryToGet)
	     return iToFind;
  return -1;
}

function searchAddrIndexFromWif(wifToTryToGet)
{
  for(iToFind = 0; iToFind < KNOWN_ADDRESSES.length; ++iToFind)
      if(KNOWN_ADDRESSES[iToFind].account.WIF == wifToTryToGet)
	     return iToFind;
  return -1;
}

function getWifIfKnownAddress(addressToTryToGet)
{
  var index = searchAddrIndexFromBase58(addressToTryToGet);
  if (index != -1)
      return KNOWN_ADDRESSES[index].account.WIF;
  else
      return -1;
}
