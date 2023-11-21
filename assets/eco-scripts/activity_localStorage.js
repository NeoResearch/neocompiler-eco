function getActivitiesFromLocalStorage() {
    var actitiviesRelayedTxs = getLocalStorage("myactivities");
    if (actitiviesRelayedTxs)
        return JSON.parse(actitiviesRelayedTxs)

    return new [];
}

function storeActivitiesToLocalStorage() {
    setLocalStorage("myactivities", JSON.stringify(RELAYED_TXS));
}

function restoreRelayedTxsFromLocalStorage() {
    RELAYED_TXS = getActivitiesFromLocalStorage();
    drawRelayedTXs();
}

function cleanAllRelayedTxs() {
    swal({
        title: "Delete all Relayed Txs activity?",
        text: "This is permanent and you won't be able to retrieve it.",
        icon: "warning",
        buttons: ["Cancel", "Delete it!"],
        dangerMode: true,
    }).then((willDelete) => {
        if (willDelete) {
            RELAYED_TXS = [];
            storeActivitiesToLocalStorage();
            drawRelayedTXs();
        } else {
            swal("Safe! Relayed TXs are preserved.");
        }
    });
}