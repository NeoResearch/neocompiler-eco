var ECO_WALLET = [];

var map = new Object();

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
//AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU
//owners: [{publicKey: "AKkkumHbBipZ46UMZJoFynJMXzSRnBvKcs"},{publicKey: "AWLYWXB8C9Lt1nHdDZJnC5cpYJjgRDLk17"},{publicKey: "AR3uEnLUdfm1tPMJmiJQurAXGL7h3EXQ2F"},{publicKey: "AJmjUqf1jDenxYpuNS4i2NxD9FQYieDpBF"}
//ECO_WALLET.push({ type: 'multisig', addressBase58: '', pKeyWif: '', privKey: '', pubKey: '', print: true, verificationScript: '532102103a7f7dd016558597f7960d27c516a4394fd968b9e65155eb4b013e4040406e2102a7bc55fe8684e0119768d104ba30795bdcc86619e864add26156723ed185cd622102b3622bf4017bdfe317c58aed5f4c753f206b7db896046fa7d774bbc4bf7f8dc22103d90c07df63e690ce77912e10ab51acc944b66860237b608c4f8f8309e71ee69954ae',
//owners: '' });

// ==============================================================================================
// Genesis Multi-sig - Owners of 'AZ81H31DMWzbSnFDLFkzh9vHwaDLayV7fU'
// Signing order: [NODE2, NODE1, NODE3, NODE4]
//Node1
const accountMS1 = new Neon.wallet.Account("NgwaBkm2kPCTABxsodFLfx1g6KfMSrt3DN");
const accountMS2 = new Neon.wallet.Account("NTh3f8oDgUYQBfxm18HoAak4YUHvjaYBNv");
const accountMS3 = new Neon.wallet.Account("L4K1KDEmrNDaN3ZbhUSQNuG9nz3oMogKdaKbsk67p6TTMpjWGi8f");
const accountMS4 = new Neon.wallet.Account("02eadf0ac71951cd8a399cb92c1ae7cb192c869a010835521dfc266fbd46727b76");
ECO_WALLET.push({
    account: accountMS1,
    print: true
});
//Node2
ECO_WALLET.push({
    account: accountMS2,
    print: true
});
//Node3
ECO_WALLET.push({
    account: accountMS3,
    print: true
});
//Node4
ECO_WALLET.push({
    account: accountMS4,
    print: true
});
// ==============================================================================================

const genesisMultiSigAccount = Neon.wallet.Account.createMultiSig(3, [
    accountMS2.publicKey,
    accountMS4.publicKey,
    accountMS1.publicKey,
    accountMS3.publicKey
]);

ECO_WALLET.push({
    account: genesisMultiSigAccount,
    print: true,
    owners: ''
});

// NEP-2 Encrypted wallet
// newWallet = new Neon.wallet.Account("02eaa8dcf4e94fbb2c0e6d10500b4c14f1deecf68720769d29b163555fe8202e")
// password = "eco" for AbotXHRH1xRhLCf74mvm8Uv49kQaCayQzr
// encrypted NEP2 = 6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU
ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU"),
    print: true
});

window.storedECO_WALLET = ECO_WALLET;