function addLocalPrivateNet() {
    const config = {
        name: 'LocalPrivateNet',
        extra: {
            neoscan: getFirstAvailableService("neoscan", localHostNodes) + "/api/main_net"
        }
    }
    const localprivateNet = new Neon.rpc.Network(config);
    Neon.default.add.network(localprivateNet);
    //console.log(Neon.settings.networks['LocalPrivateNet']);
}

function addSharedPrivateNet() {
    const config = {
        name: 'SharedPrivateNet',
        extra: {
            neoscan: getFirstAvailableService("neoscan", ecoNodes) + "/api/main_net"
        }
    }
    const sharedprivateNet = new Neon.rpc.Network(config);
    Neon.default.add.network(sharedprivateNet);
    //console.log(Neon.settings.networks['SharedPrivateNet'])
}

function setNeonApiProvider(networkToCall)
{	
            if($("#cbx_enable_neoscan")[0].checked)
            	NEON_API_PROVIDER = new Neon.api.neoscan.instance(networkToCall);
            else 
            	NEON_API_PROVIDER = new Neon.api.neoCli.instance(BASE_PATH_CLI);
}

function getStorage(scripthashContext, key, url) {
    query = Neon.rpc.Query.getStorage(scripthashContext, key);
    response = query.execute(url);
    console.log(response);
    return response;
}

/*
function CreateRawTx( rawData ){
  // just for test
  //query = Neon.rpc.Query.sendRawTransaction(rawData);
  query = Neon.rpc.Query.sendRawTransaction('800000014BFA9098EC9C5B95E4EC3045A2A2D04A10F12228A3267A3AC65265428ABDC1D3010002E72D286979EE6CB1B7E65DFDDFB2E384100B8D148E7758DE42E4168B71792C6000E1F505000000004E75C523C4D431DAFED515E5E230F11A4DB5A80FE72D286979EE6CB1B7E65DFDDFB2E384100B8D148E7758DE42E4168B71792C6000EF54A91C000000 513FF03F3A5648BE47CC82F6571251F57173CF8601060004303231347755C56B6C766B00527AC46C766B51527AC4616168164E656F2E52756E74696D652E47657454726967676572009C6C766B52527AC46C766B52C3642A00616C766B00C30430323134876C766B53527AC46C766B53C3640E00516C766B54527AC4620F0061006C766B54527AC46203006C766B54C3616C7566');
  response = query.execute(BASE_PATH_CLI);
  console.log(response);
}
*/
