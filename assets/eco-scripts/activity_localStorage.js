function getActivitiesFromLocalStorage() {
    var actitiviesRelayedTxs = getLocalStorage("myactivities");
    if (actitiviesRelayedTxs)
        return JSON.parse(actitiviesRelayedTxs)

    return [];
}

function storeActivitiesToLocalStorage() {
    setLocalStorage("myactivities", JSON.stringify(RELAYED_TXS));
}

function restoreRelayedTxsFromLocalStorage() {
    RELAYED_TXS = getActivitiesFromLocalStorage();
    drawRelayedTXs();
}

function cleanAllRelayedTxs() {
    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: "btn btn-danger",
            cancelButton: "btn btn-success"
        },
        buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
        title: "Delete all Relayed Txs activity?",
        text: "This is permanent and you won't be able to retrieve it.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        color: "#00AF92",
        background: "#263A40",
    }).then((result) => {
        if (result.isConfirmed) {
            RELAYED_TXS = [];
            storeActivitiesToLocalStorage();
            drawRelayedTXs();
        } else {
            swal2Simple("Safe!", "Relayed TXs are preserved.", 5500, "success");
        }
    });
}