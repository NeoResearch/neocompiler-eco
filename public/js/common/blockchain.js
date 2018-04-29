function getPrivateNetPath(){
  return NEOSCAN_PATH + '/api/main_net';
}

function addPrivateNet(){
  const config = {
    name: 'PrivateNet',
    extra: {
      neoscan: getPrivateNetPath()
    }
  }
  const privateNet = new Neon.rpc.Network(config)
  Neon.default.add.network(privateNet)
  console.log(Neon.settings.networks['PrivateNet'])
}

// =============================================
//First examples of using Neon-JS in connection with neo-scan for broadcasting to private net RPC clients
function neonJSPlayground(){
  var NeonA = Neon.default
  const query = Neon.default.create.query()
  var wallet = Neon.wallet
  console.log("query: " + query)
  console.log("wallet: " + wallet)
  var tx = Neon.tx
  console.log("tx: " + tx)
  let tx2 = Neon.default.create.tx({type: 128})
  console.log("tx2: " + tx2)

  balance = Neon.api.neoscan.getBalance('PrivateNet', "AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y")
  .then(res => console.log(res))


  const intent = Neon.api.makeIntent({NEO:1,GAS:500}, 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y')
  console.log(intent) // This is an array of 2 Intent objects, one for each asset
  const configTest = {
    net: 'PrivateNet', // The network to perform the action, MainNet or TestNet.
    url: NODES_CSHARP_PATH,
    address: 'AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y',  // This is the address which the assets come from.
    privateKey: 'KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr',
    intents: intent
  }

  Neon.default.sendAsset(configTest)
  .then(res => {
    console.log(res.response)
  })
  .catch(e => {
    console.log(e)
  })

  const sb = Neon.default.create.scriptBuilder()

  //sb.emitAppCall('35816a2b6f823a28aa6674ca56c28862fe419f8', 'name')
  //const tx3 = Neon.default.create.invocationTx('KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr', {}, {}, sb.str, 0)
}//END First examples of using Neon-JS in connection with neo-scan for broadcasting to private net RPC clients
// =============================================

function CreateTx( from, fromPrivateKey, to, neo, gas ){
    balance = Neon.api.neoscan.getBalance('PrivateNet', from)
    .then(res => console.log(res))


    const intent = Neon.api.makeIntent({NEO:neo,GAS:gas}, to)
    console.log(intent) // This is an array of 2 Intent objects, one for each asset
    const configTest = {
        net: 'PrivateNet', // The network to perform the action, MainNet or TestNet.
        url: NODES_CSHARP_PATH,
        address: from,  // This is the address which the assets come from.
        privateKey: fromPrivateKey,
        intents: intent
    }

    Neon.default.sendAsset(configTest)
    .then(res => {
        console.log(res.response)
    })
    .catch(e => {
        console.log(e)
    })
}

function CreateRawTx( rawData ){
  query = Neon.rpc.Query.sendRawTransaction('800000014BFA9098EC9C5B95E4EC3045A2A2D04A10F12228A3267A3AC65265428ABDC1D3010002E72D286979EE6CB1B7E65DFDDFB2E384100B8D148E7758DE42E4168B71792C6000E1F505000000004E75C523C4D431DAFED515E5E230F11A4DB5A80FE72D286979EE6CB1B7E65DFDDFB2E384100B8D148E7758DE42E4168B71792C6000EF54A91C000000 513FF03F3A5648BE47CC82F6571251F57173CF8601060004303231347755C56B6C766B00527AC46C766B51527AC4616168164E656F2E52756E74696D652E47657454726967676572009C6C766B52527AC46C766B52C3642A00616C766B00C30430323134876C766B53527AC46C766B53C3640E00516C766B54527AC4620F0061006C766B54527AC46203006C766B54C3616C7566');
  response = query.execute(getPrivateNetPath());
  console.log(response);
}
