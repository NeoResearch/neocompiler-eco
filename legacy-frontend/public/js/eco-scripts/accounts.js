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
const accountMS1 = new Neon.wallet.Account("02f054588f8e48da6626f0000463294a3b3408fde8ee4cd2f04ac1d9a2fe9299e7");
const accountMS2 = new Neon.wallet.Account("03b58dc798ee8635a130a92ec76ae7fc54d030b0ea5b63b3c0cd5ce258fd0b90c8");
const accountMS3 = new Neon.wallet.Account("0285d57106beb051982c1f3228db9f00e24bf2564f41078fc6a93a3c652afc715b");
const accountMS4 = new Neon.wallet.Account("023dd1d74babb78eaf99624e252f9f292d34f031f8e0e5c9300a89833f69c7bc67");



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


/*
                foreach (ECPoint publicKey in publicKeys.OrderBy(p => p))
                {
                    sb.EmitPush(publicKey.EncodePoint(true));
                }
*/                

const genesisMultiSigAccount = Neon.wallet.Account.createMultiSig(3, [
    accountMS4.publicKey,
    accountMS3.publicKey,
    accountMS2.publicKey,
    accountMS1.publicKey
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
