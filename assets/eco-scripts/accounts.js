var DEFAULT_WALLET = [];
var ECO_WALLET = [];
var ECO_EXTRA_ACCOUNTS = [];
//var map = new Object();

DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("KxDgvEKzgSBPPfuVfw67oPQBSjidEiqTHURKSDL1R7yGaGYAeYnr"),
    label: "Eco 1",
    print: true
});
DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("L56SWKLsdynnXTHScMdNjsJRgbtqcf9p5TUgSAHq242L2yD8NyrA"),
    label: "Eco 2",
    print: true
});
DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("KzFWMRCMxXQpB13d17AMrzN1ZvUT81qs1pzeyfuy4vUC84Zs5PEU"),
    label: "CN1",
    print: true
});
DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("L1v8pdiuA25a9phLLZjE6CPPgvHJ8mDgun1D2hsbQ3RmA5sB5YCH"),
    label: "CN2",
    print: true
});
DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("KycqJ9dB8ij1DoViqtybwGWGtWSAiUDXP4FGFrWAs4F1FJ2Ponn1"),
    label: "CN3",
    print: true
});
DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("Kz1And2fvFUxuJ5BuC8Ghjgs8Uz7oH2MbuipYX4UjhTihGqTceSm"),
    label: "CN4",
    print: true
});
DEFAULT_WALLET.push({
    account: new Neon.wallet.Account("02cd0cc5b234a29f91d523b00bcd3ba204a887de838045bf55c54ae7052db8e22b"),
    label: "OraclePub",
    print: true
});
ECO_WALLET = DEFAULT_WALLET;

// NEP-2 Encrypted wallet
// newWallet = new Neon.wallet.Account("02eaa8dcf4e94fbb2c0e6d10500b4c14f1deecf68720769d29b163555fe8202e")
// password = "eco" for AbotXHRH1xRhLCf74mvm8Uv49kQaCayQzr
// encrypted NEP2 = 6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU
/*ECO_WALLET.push({
    account: new Neon.wallet.Account("6PYMLN5gxjEJ1u4zoTADWM2gphfXRszFKi4QCq6FjwumwPWsf1LoZpvFxU"),
    print: true
});*/