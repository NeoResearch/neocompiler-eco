neo3Dapi?.addEventListener(neo3Dapi.Constants.EventName.READY, () => {
    onReadyWebO3();
    console.log("O3 is ready!");
    READY_DAPI_WALLETS.O3WALLET = true;
})

function onReadyWebO3() {
    neo3Dapi?.addEventListener(neo3Dapi.Constants.EventName.DISCONNECTED, () => {
        console.log("O3 DISCONNECTING");
    })
    neo3Dapi?.addEventListener(neo3Dapi.Constants.EventName.ACCOUNT_CHANGED, (result) => {
        console.log("New address connected O3 following addEventListener neo3Dapi: " + result.address);
    })
    neo3Dapi?.addEventListener(neo3Dapi.Constants.EventName.NETWORK_CHANGED, (result) => {
        console.log("Hi Network new o3" + result.defaultNetwork);
    })
}