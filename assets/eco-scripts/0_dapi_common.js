var READY_DAPI_WALLETS = { NEOLINE: false, O3WALLET: false };

var CONNECTED_DAPI_WALLET = "NONE";

function getNetworkDAPI(dapiObj, accountToSwal = false) {
    return dapiObj
        ?.getNetworks()
        .then((result) => {
            //shouldUpdate && store.dispatch(batchUpdate({ network: result.defaultNetwork }))
            console.log(result.defaultNetwork);

            if (accountToSwal != false)
                swal({
                    title: "NeoLine Connected!",
                    text: "NeoLine connected account is " + accountToSwal + " and Network is " + result.defaultNetwork,
                    icon: "success",
                    timer: 5500,
                });
        })
}

function getAccountDAPI(dapiObj, dapiName) {
    dapiObj
        ?.getAccount()
        .then((account) => {
            CONNECTED_DAPI_WALLET = dapiName;
            console.log(account.address);
            getNetworkDAPI(dapiObj, account.address);
            deleteAndAddDAPIAddressToWallet(account.address);
            changeDefaultWallet(getDapiConnectedWallet(), false, false);
        }).catch((error) => convertWalletError(error))
}

function invokeWithParametersDAPI(dapiObj, scriptHashP, methodP, invokeparams, signerAccount) {
    dapiObj
        ?.invoke({
            scriptHash: scriptHashP,
            operation: methodP,
            args: invokeparams,
            fee: '0',
            broadcastOverride: false,
            signers: [
                {
                    account: signerAccount,
                    scopes: 1,
                },
            ],
        })
        .then((result) => {
            console.log("Result txid " + result.txid)
            return result.txid
        })
        .catch((error) => {
            convertWalletError(error)
            console.log("-1")
            return '-1'
        })
        .then(async (result) => {
            if (result === '-1') {
                return {
                    status: 'error',
                }
            } else {
                console.log("Try app Log")
            }
        })
}

function getDapiConnectedWallet() {
    for (ka = 0; ka < ECO_WALLET.length; ka++) {
        if (ECO_WALLET[ka].label.slice(0, 9) == "Connected")
            return ka;
    }

    return -1;
}

function deleteConnectedDAPIWallet() {
    var connectedWallet = getDapiConnectedWallet();
    if (connectedWallet != -1) {
        console.log("Deleting wallet ID" + connectedWallet);
        deleteAccount(connectedWallet);
    }
}

function deleteAndAddDAPIAddressToWallet(keyToAdd) {
    deleteConnectedDAPIWallet();
    var accountToAdd = new Neon.wallet.Account(keyToAdd)
    var labelToAdd = "Connected_" + CONNECTED_DAPI_WALLET;
    if (addToWallet(accountToAdd, labelToAdd))
        updateAllWalletData();
}

function convertWalletError(error) {
    switch (error.type) {
        case 'NO_PROVIDER':
            console.log('No provider available.')
            break
        case 'CONNECTION_DENIED':
            console.log('The user rejected the request to connect with your dApp')
            break
        case 'CONNECTION_REFUSED':
            console.log('The user rejected the request to connect with your dApp')
            break
        case 'RPC_ERROR':
            console.log('There was an error when broadcasting this transaction to the network.')
            break
        case 'MALFORMED_INPUT':
            console.log('The receiver address provided is not valid.')
            break
        case 'CANCELED':
            console.log('The user has canceled this transaction.')
            break
        case 'INSUFFICIENT_FUNDS':
            console.log('The user has insufficient funds to execute this transaction.')
            break
        case 'CHAIN_NOT_MATCH':
            console.log(
                'The currently opened chain does not match the type of the call chain, please switch the chain.'
            )
            break
        default:
            console.error(error)
            break
    }
}