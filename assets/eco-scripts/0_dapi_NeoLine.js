
var neoline;
var neolineN3;

$(window).on('load', () => {

});


/*window.addEventListener('NEOLine.NEO.EVENT.READY', () => {
    if (window.NEOLine && window.NEOLineN3) {
        onReadyWeb()
    }
})*/

window.addEventListener('NEOLine.N3.EVENT.READY', () => {
    if (window.NEOLine && window.NEOLineN3) {
        onReadyWeb()
    }
})



function onReadyWeb() {
    if (!neoline || !neolineN3) {
        neoline = new window.NEOLine.Init()
        neolineN3 = new window.NEOLineN3.Init()
    }

    neoline?.addEventListener(neoline.EVENT.DISCONNECTED, () => {
        disconnect()
    })

    if (sessionStorage.getItem('connect') === 'true' && sessionStorage.getItem('preConnectWallet') === 'Neoline') {
        getAccount()
    }

    neoline?.addEventListener(neoline.EVENT.NETWORK_CHANGED, (result) => {
        console.log("Hi Network new" + result.defaultNetwork);
    })

    neoline?.addEventListener(neoline.EVENT.ACCOUNT_CHANGED, (result) => {
        console.log("New address connected following addEventListener: " + result.address);
        addDAPIAddressToWallet(result.address);
    })
}

function invokeWithParametersNeoLine() {

    return neolineN3
        ?.invoke({
            scriptHash: "0xef4073a0f2b305a38ec4050e4d3d28bc40ea63f5",
            operation: 'balanceOf',
            args: [
                {
                    type: 'Hash160',
                    value: "b984eaa6d748cabb505ceadbd792bf2e8d903ada",
                },
            ],
            fee: '0.1',
            broadcastOverride: false,
            signers: [
                {
                    account: "0x7503501b58e0a28101e7cc171d81734885cca792",
                    scopes: 1,
                },
            ],
        })
        .then((result) => {
            console.log("Result txid" + result.txid)
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
                /*const status = await getApplicationLog(result)
                return {
                    status,
                    txid: result,
                }*/
            }
        })

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

/*
const initDapi = () => {
    const onReady = _.once(async () => {
        if (!neoline || !neolineN3) {
            neoline = new window.NEOLine.Init()
            neolineN3 = new window.NEOLineN3.Init()
        }
        neoline?.addEventListener(neoline.EVENT.DISCONNECTED, () => {
            disconnect()
        })
        neoline?.addEventListener(neoline.EVENT.ACCOUNT_CHANGED, (result: AccountInfo) => {
            store.dispatch(batchUpdate({ address: result.address }))
        })
        neoline?.addEventListener(neoline.EVENT.NETWORK_CHANGED, (result: Network) => {
            store.dispatch(batchUpdate({ network: result.defaultNetwork }))
        })
        if (sessionStorage.getItem('connect') === 'true' && sessionStorage.getItem('preConnectWallet') === 'Neoline') {
            getAccount()
        }
    })
    if (window.NEOLine && window.NEOLineN3) {
        onReady()
        return
    }
    window.addEventListener('NEOLine.NEO.EVENT.READY', () => {
        if (window.NEOLine && window.NEOLineN3) {
            onReady()
        }
    })
    window.addEventListener('NEOLine.N3.EVENT.READY', () => {
        if (window.NEOLine && window.NEOLineN3) {
            onReady()
        }
    })
}
*/

function getNetwork() {
    return neoline
        ?.getNetworks()
        .then((result) => {
            //shouldUpdate && store.dispatch(batchUpdate({ network: result.defaultNetwork }))
            console.log(result.defaultNetwork)
            return result.defaultNetwork
        })
}

function getAccount() {
    neoline
        ?.getAccount()
        .then((account) => {
            getNetwork(true)
            sessionStorage.setItem('preConnectWallet', 'Neoline')
            console.log(account.address);
            addDAPIAddressToWallet(account.address);
            /*
            store.dispatch(
                batchUpdate({
                    walletName: 'Neoline',
                    address: account.address,
                })
            )*/
        })
}


function getConnectedWallet() {
    for (ka = 0; ka < ECO_WALLET.length; ka++) {
        if (ECO_WALLET[ka].label.slice(0, 9) == "Connected")
            return ka;
    }

    return -1;
}

function deleteConnectedWallet()
{
    var connectedWallet = getConnectedWallet();
    if (connectedWallet != -1) {
        console.log("Deleting wallet ID" + connectedWallet);
        deleteAccount(connectedWallet);
    }
}

function addDAPIAddressToWallet(keyToAdd) {
    deleteConnectedWallet();

    var accountToAdd = new Neon.wallet.Account(keyToAdd)
    var labelToAdd = "Connected_" + sessionStorage.getItem('preConnectWallet');
    if (addToWallet(accountToAdd, labelToAdd))
        updateAllWalletData();
}