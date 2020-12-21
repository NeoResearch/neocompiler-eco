var ECO_WALLET = [];

//var map = new Object();

//Template
//ECO_WALLET.push({ type: 'commonAddress, multisig or specialSC', addressBase58: '', pKeyWif: '', privKey: '', pubKey: '', print: false, verificationScript: ''});
//AK2nJJpJr6o664CWJKi1QRXjqeic2zRp8y
ECO_WALLET.push({
    account: new Neon.wallet.Account("KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr"),
    print: true
});
//APLJBPhtRg2XLhtpxEHd6aRNL7YSLGH2ZL
ECO_WALLET.push({
    account: new Neon.wallet.Account("L56SWKLsdynnXTHScMdNjsJRgbtqcf9p5TUgSAHq242L2yD8NyrA"),
    print: true
});
//AXxCjds5Fxy7VSrriDMbCrSRTxpRdvmLtx
ECO_WALLET.push({
    account: new Neon.wallet.Account("KwNkjjrC5BLwG7bQuzuVbFb5J4LN38o1A8GDX4eUEL1JRNcVNs9p"),
    print: true
});
//AQaJZTKshTQzcCKmsaoNVrtSP1pEB3Utn9
ECO_WALLET.push({
    account: new Neon.wallet.Account("KxPHsCAWkxY9bgNjAiPmQD87ckAGR79z41GtwZiLwxdPo7UmqFXV"),
    print: true
});

// NEP-2 Encrypted wallet
// newWallet = new Neon.wallet.Account("02eaa8dcf4e94fbb2c0e6d10500b4c14f1deecf68720769d29b163555fe8202e")
// password = "eco" for AbotXHRH1xRhLCf74mvm8Uv49kQaCayQzr
// encrypted NEP2 = 6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU
/*ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU"),
    print: true
});*/

window.storedECO_WALLET = ECO_WALLET;