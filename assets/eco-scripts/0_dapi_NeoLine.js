// Thanks Neoburguer team for the guideline
// https://github.com/neoburger/web/tree/master/resources/utils/api

var neoline;
var neolineN3;

/*window.addEventListener('NEOLine.NEO.EVENT.READY', () => {
    if (window.NEOLine && window.NEOLineN3) {
        onReadyWeb()
    }
})*/

window.addEventListener('NEOLine.N3.EVENT.READY', () => {
    if (window.NEOLine && window.NEOLineN3) {
        onReadyWebNeoLine();
        READY_DAPI_WALLETS.NEOLINE = true;
    }
})

function onReadyWebNeoLine() {
    if (!neoline || !neolineN3) {
        neoline = new window.NEOLine.Init()
        neolineN3 = new window.NEOLineN3.Init()
    }

    neoline?.addEventListener(neoline.EVENT.DISCONNECTED, () => {
        console.log("NEOLINE DISCONNECTING");
        //disconnect()
    })

    if (sessionStorage.getItem('connect') === 'true' && sessionStorage.getItem('preConnectWallet') === 'Neoline') {
        getAccount();
    }

    neoline?.addEventListener(neoline.EVENT.NETWORK_CHANGED, (result) => {
        console.log("Hi Network new" + result.defaultNetwork);
    })

    neoline?.addEventListener(neoline.EVENT.ACCOUNT_CHANGED, (result) => {
        console.log("New address connected following addEventListener: " + result.address);
        addDAPIAddressToWallet(result.address);
    })
}
