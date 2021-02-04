var ECO_WALLET = [];

//var map = new Object();

ECO_WALLET.push({
    account: new Neon.wallet.Account("KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr"),
    label: "Eco 1",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("L56SWKLsdynnXTHScMdNjsJRgbtqcf9p5TUgSAHq242L2yD8NyrA"),
    label: "Eco 2",
    print: true
});

ECO_WALLET.push({
    account: new Neon.wallet.Account("L4W9Par7Kb3qhqE5YQjYaV2gScaMFBEBi1819HtSQsSHAjJE8jsZ"),
    label: "CN1",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("L2Mt5aqiXGVQNmdL9dYof9HzLnWbpuGuv35RbwzESRNnwYDa4cdL"),
    label: "CN2",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("L2Cxz5JXM6Mh6CACRbXuoV2V8MRbgb9JT6wZH1xf9o26cxGwf9ni"),
    label: "CN3",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("L1EhXFbsjFNv9uCC16AzmPWGjJtEGc1Ab19t9UJGiXRyJHpYdxxc"),
    label: "CN4",
    print: true
});

/*
ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYMM6gD8HhUjxobTp5eFgHbqFp5n49ZApNJViU9wnRjyfF2KYsbLg28Kr"),
    label: "CN1",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYPN45cvWWCSWfxRczVfS7Jd1hRS5DbBg9LYhngr4XKSguCLzax7o7wD8"),
    label: "CN2",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYQcsb2qphUPJYSA2MuQDsQWvTY8zcVKsCQ7eQhtjmGhJtYt8WwAcpLHV"),
    label: "CN3",
    print: true
});
ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYNTWDFJ2wGNzXx6QNsrn2jWXbEJXEakdb2bHvU9bm4AcBEwDxpqgjctG"),
    label: "CN4",
    print: true
});
ECO_WALLET[ECO_WALLET.length - 1].account.decrypt("one");
*/



// NEP-2 Encrypted wallet
// newWallet = new Neon.wallet.Account("02eaa8dcf4e94fbb2c0e6d10500b4c14f1deecf68720769d29b163555fe8202e")
// password = "eco" for AbotXHRH1xRhLCf74mvm8Uv49kQaCayQzr
// encrypted NEP2 = 6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU
/*ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU"),
    print: true
});*/

window.storedECO_WALLET = ECO_WALLET;